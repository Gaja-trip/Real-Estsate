param(
  [Parameter(Mandatory = $true)]
  [string]$ImagePath,
  [string]$OutputPath,
  [string]$LanguageTag = "ko"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.SoftwareBitmap, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrResult, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Storage.FileAccessMode, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.IRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]

function Await-WinRtOperation {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Operation,
    [Parameter(Mandatory = $true)]
    [type]$ResultType
  )

  $asTaskMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object {
      $_.Name -eq "AsTask" -and
      $_.IsGenericMethod -and
      $_.GetParameters().Count -eq 1
    } |
    Select-Object -First 1

  $task = $asTaskMethod.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $task.Wait()
  return $task.Result
}

$resolvedImagePath = (Resolve-Path -LiteralPath $ImagePath).Path
$language = New-Object Windows.Globalization.Language $LanguageTag
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)

if ($null -eq $engine) {
  throw "The Windows OCR engine is unavailable for language: $LanguageTag"
}

$file = Await-WinRtOperation (
  [Windows.Storage.StorageFile]::GetFileFromPathAsync($resolvedImagePath)
) ([Windows.Storage.StorageFile])

$stream = Await-WinRtOperation (
  $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
) ([Windows.Storage.Streams.IRandomAccessStream])

$decoder = Await-WinRtOperation (
  [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
) ([Windows.Graphics.Imaging.BitmapDecoder])

$bitmap = Await-WinRtOperation (
  $decoder.GetSoftwareBitmapAsync()
) ([Windows.Graphics.Imaging.SoftwareBitmap])

$result = Await-WinRtOperation (
  $engine.RecognizeAsync($bitmap)
) ([Windows.Media.Ocr.OcrResult])

$lines = foreach ($line in $result.Lines) {
  $words = @($line.Words)
  if ($words.Count -eq 0) {
    continue
  }

  $left = ($words | ForEach-Object { $_.BoundingRect.X } | Measure-Object -Minimum).Minimum
  $top = ($words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum
  $right = ($words | ForEach-Object {
    $_.BoundingRect.X + $_.BoundingRect.Width
  } | Measure-Object -Maximum).Maximum
  $bottom = ($words | ForEach-Object {
    $_.BoundingRect.Y + $_.BoundingRect.Height
  } | Measure-Object -Maximum).Maximum

  [pscustomobject]@{
    text = $line.Text
    x = [math]::Round([double]$left, 2)
    y = [math]::Round([double]$top, 2)
    width = [math]::Round([double]($right - $left), 2)
    height = [math]::Round([double]($bottom - $top), 2)
  }
}

$payload = [ordered]@{
  image = $resolvedImagePath
  width = $bitmap.PixelWidth
  height = $bitmap.PixelHeight
  text = $result.Text
  lines = @($lines)
}

$json = $payload | ConvertTo-Json -Depth 5

if ($OutputPath) {
  $resolvedOutputPath = [System.IO.Path]::GetFullPath(
    (Join-Path (Get-Location) $OutputPath)
  )
  $outputDirectory = [System.IO.Path]::GetDirectoryName($resolvedOutputPath)
  [System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($resolvedOutputPath, $json, $encoding)
} else {
  $json
}

$stream.Dispose()
$bitmap.Dispose()
