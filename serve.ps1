param(
  [string]$Root = "c:\Users\admin\OneDrive\Desktop\Project\Figma Live Project",
  [int]$Port = 5173,
  [string]$Bind = "127.0.0.1"
)
Add-Type -AssemblyName System.Net
$prefix = "http://$($Bind):$($Port)/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Clear()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Root at $prefix (Ctrl+C to stop)"

function Get-ContentType([string]$path){
  switch ([IO.Path]::GetExtension($path).ToLower()){
    ".html" { return "text/html; charset=utf-8" }
    ".css"  { return "text/css" }
    ".js"   { return "application/javascript" }
    ".json" { return "application/json" }
    ".png"  { return "image/png" }
    ".jpg"  { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".svg"  { return "image/svg+xml" }
    default  { return "application/octet-stream" }
  }
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
    $full = Join-Path $Root $rel
    if ((Test-Path $full) -and -not (Get-Item $full).PSIsContainer) {
      try {
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $ctx.Response.StatusCode = 200
        $ctx.Response.ContentType = Get-ContentType $full
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } catch {
        $ctx.Response.StatusCode = 500
        $msg = [Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
      }
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes("Not Found")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
