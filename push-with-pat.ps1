# Script to push to paultechsolutions repo using PAT authentication
# Run this script and paste your PAT when prompted (it will be hidden)

$pat = Read-Host "Paste your GitHub PAT (it will be hidden)" -AsSecureString
$patPlainText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($pat))

# URL-encode the PAT (replace special characters that cause URL parsing errors)
$encodedPat = [System.Web.HttpUtility]::UrlEncode($patPlainText)

# Set up git credential helper temporarily
$remoteUrl = "https://paultechsolutions:${encodedPat}@github.com/paultechsolutions/Women-empowerment-resource-portal.git"

# Push to the remote
Write-Host "Pushing to paultechsolutions/Women-empowerment-resource-portal..."
git push $remoteUrl HEAD:main -u

# Clear the token from memory
$patPlainText = $null
$encodedPat = $null
Write-Host "Done. Token cleared from memory."
