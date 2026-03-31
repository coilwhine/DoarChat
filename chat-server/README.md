# DoarChat Server

## Local secrets

The JWT signing key must not be committed to source control. Set it via User Secrets for local development:

```bash
dotnet user-secrets init
```

Generate a strong 32-byte key and set it:

```powershell
dotnet user-secrets set "Jwt:Key" ([Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256})))
```

For production, provide the key via environment variables or a secret store:

```
Jwt__Key=YOUR_PROD_SECRET
```
