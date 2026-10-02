# Place this file beside package.json. Works in Windows PowerShell 5.1.
# Publishes the existing main branch to saeideeshghi/marpich-sanat.
& {
    $ErrorActionPreference = 'Stop'
    $PSNativeCommandUseErrorActionPreference = $false

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

    Invoke-MpsStep -Program 'git' -CommandArgs @('switch', 'main')
    Invoke-MpsStep -Program 'git' -CommandArgs @('remote', 'set-url', 'origin', 'https://github.com/saeideeshghi/marpich-sanat.git')

    Invoke-MpsStep -Program 'git' -CommandArgs @('add', '-A')
    & git diff --cached --quiet
    $mpsDiffExit = $LASTEXITCODE
    if ($mpsDiffExit -eq 1) {
        Invoke-MpsStep -Program 'git' -CommandArgs @('commit', '-m', 'Update v2 frontend')
    } elseif ($mpsDiffExit -ne 0) {
        throw 'Git could not check staged changes. Read the error above.'
    }

    Invoke-MpsStep -Program 'git' -CommandArgs @('pull', '--rebase', 'origin', 'main')
    Invoke-MpsStep -Program 'npm.cmd' -CommandArgs @('ci')
    Invoke-MpsStep -Program 'npm.cmd' -CommandArgs @('run', 'check')
    Invoke-MpsStep -Program 'npm.cmd' -CommandArgs @('run', 'build:pages')
    Invoke-MpsStep -Program 'git' -CommandArgs @('push', 'origin', 'main:main')

    Write-Host '[OK] Push complete. Wait for GitHub Actions to turn green.'
    Write-Host 'https://github.com/saeideeshghi/marpich-sanat/actions'
}
