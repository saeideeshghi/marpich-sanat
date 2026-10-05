# Place beside package.json. Compatible with Windows PowerShell 5.1.
# Publishes main and creates the immutable v3 release tag in one Git push.
& {
    $ErrorActionPreference = 'Stop'
    $PSNativeCommandUseErrorActionPreference = $false
    $mpsReleaseTag = 'v3'
    $mpsReleaseVersion = '3.0.0'

    if ($PSScriptRoot) {
        Set-Location -LiteralPath $PSScriptRoot
    }
    if (-not (Test-Path -LiteralPath '.\package.json' -PathType Leaf)) {
        throw 'Run from the project folder beside package.json.'
    }

    function Invoke-MpsStep {
        param([string]$Program, [string[]]$CommandArgs)
        Write-Host ('> {0} {1}' -f $Program, ($CommandArgs -join ' '))
        & $Program @CommandArgs
        $mpsExit = $LASTEXITCODE
        if ($mpsExit -ne 0) {
            throw ('Stopped: {0} failed with exit code {1}. Read the error above.' -f $Program, $mpsExit)
        }
    }

    Invoke-MpsStep -Program 'git' -CommandArgs @('rev-parse', '--is-inside-work-tree')
    $mpsOrigin = & git remote get-url origin
    if ($LASTEXITCODE -ne 0 -or $mpsOrigin -notmatch '^(https://github\.com/saeideeshghi/marpich-sanat(?:\.git)?/?|git@github\.com:saeideeshghi/marpich-sanat(?:\.git)?)$') {
        throw 'Origin must point to saeideeshghi/marpich-sanat. Run this script in that repository clone.'
    }
    Invoke-MpsStep -Program 'git' -CommandArgs @('switch', 'main')

    # Existing version tags are never moved or overwritten.
    & git show-ref --verify --quiet ('refs/tags/' + $mpsReleaseTag)
    $mpsTagExit = $LASTEXITCODE
    if ($mpsTagExit -eq 0) {
        throw 'Local tag v3 already exists. If a previous push failed, use the retry command in GITHUB-UPLOAD.md.'
    } elseif ($mpsTagExit -ne 1) {
        throw 'Git could not check local tags.'
    }
    $mpsRemoteTags = @(& git ls-remote --tags origin ('refs/tags/' + $mpsReleaseTag))
    if ($LASTEXITCODE -ne 0) {
        throw 'Git could not check the remote tag. No changes were published.'
    }
    if ($mpsRemoteTags.Count -gt 0) {
        throw 'Remote tag v3 already exists. Use a new version number for a later release.'
    }
    $mpsPackage = Get-Content -LiteralPath '.\package.json' -Raw | ConvertFrom-Json
    if ($mpsPackage.version -ne $mpsReleaseVersion) {
        throw 'Merge the V3 package first. package.json must contain version 3.0.0.'
    }

    Invoke-MpsStep -Program 'node' -CommandArgs @('scripts/clean-legacy.js', '--apply')
    Invoke-MpsStep -Program 'git' -CommandArgs @('status', '--short')
    Invoke-MpsStep -Program 'git' -CommandArgs @('add', '-A')
    & git diff --cached --quiet
    $mpsDiffExit = $LASTEXITCODE
    if ($mpsDiffExit -eq 1) {
        Invoke-MpsStep -Program 'git' -CommandArgs @('commit', '-m', 'Release V3 - clean frontend and advanced customizer')
    } elseif ($mpsDiffExit -ne 0) {
        throw 'Git could not check staged changes.'
    }

    Invoke-MpsStep -Program 'git' -CommandArgs @('pull', '--rebase', 'origin', 'main')
    $mpsPackage = Get-Content -LiteralPath '.\package.json' -Raw | ConvertFrom-Json
    if ($mpsPackage.version -ne $mpsReleaseVersion) {
        throw 'The rebased package version changed. Review the merge before publishing V3.'
    }
    Invoke-MpsStep -Program 'npm.cmd' -CommandArgs @('ci')
    Invoke-MpsStep -Program 'npm.cmd' -CommandArgs @('run', 'check')
    Invoke-MpsStep -Program 'npm.cmd' -CommandArgs @('run', 'build:pages')
    $mpsPending = @(& git status --porcelain)
    if ($LASTEXITCODE -ne 0 -or $mpsPending.Count -gt 0) {
        throw 'Working files changed during validation. Review and commit them before creating v3.'
    }

    Invoke-MpsStep -Program 'git' -CommandArgs @('tag', '-a', $mpsReleaseTag, '-m', 'Marpich Sanat V3')
    Invoke-MpsStep -Program 'git' -CommandArgs @('push', '--atomic', 'origin', 'main', ('refs/tags/' + $mpsReleaseTag))
    Write-Host '[OK] V3 published: main + tag v3. Wait for GitHub Actions to turn green.'
    Write-Host 'https://github.com/saeideeshghi/marpich-sanat/actions'
}
