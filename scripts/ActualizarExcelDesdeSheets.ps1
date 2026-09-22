<#
Sincroniza libros nuevos desde un Google Sheet publico hacia libros.xlsx.
Agrega N de Inventario + Titulo + Autor de las filas del Sheet que todavia no
existan en el Excel (dedup por N de Inventario). No modifica filas existentes.

Imprime por stdout la cantidad de filas insertadas (exit code 0).
Un error se registra en -LogPath (prepend) y se manda por stderr (exit code 1).
#>
param(
    [Parameter(Mandatory = $true)][string]$SheetCsvUrl,
    [Parameter(Mandatory = $true)][string]$ExcelPath,
    [Parameter(Mandatory = $true)][string]$LogPath
)

function Write-Log {
    param([string]$Mensaje)
    $linea = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Mensaje"
    $previo = if (Test-Path $LogPath) { Get-Content -Path $LogPath -Raw } else { '' }
    Set-Content -Path $LogPath -Value ($linea + "`r`n" + $previo) -Encoding UTF8
}

function Fail {
    param([string]$Mensaje)
    Write-Log $Mensaje
    Write-Error $Mensaje
    exit 1
}

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
} catch {}

try {
    Import-Module ImportExcel -ErrorAction Stop
} catch {
    Fail "No se encontro el modulo ImportExcel: $($_.Exception.Message)"
}

try {
    $contenido = (Invoke-WebRequest -Uri $SheetCsvUrl -UseBasicParsing).Content
} catch {
    Fail "Error al descargar el Sheet: $($_.Exception.Message)"
}

if ($contenido -match '<html|<!DOCTYPE') {
    Fail "La URL configurada en sheet-url.txt es incorrecta: devolvio HTML en vez de CSV. Verificar que use el formato /export?format=csv&gid=... (no /edit)."
}

$csv = $contenido | ConvertFrom-Csv -Header Fecha, NroInventario, Autor, Titulo | Select-Object -Skip 1

# Headers reales de libros.xlsx (ej. "N Inventario (6)", "Titulo (5)"), leidos
# dinamicamente para no depender de tildes/simbolos hardcodeados en este archivo.
try {
    $headers = (Import-Excel -Path $ExcelPath -WorksheetName 'Hoja1' -NoHeader | Select-Object -First 1).PSObject.Properties.Value
    $filasExistentes = Import-Excel -Path $ExcelPath -WorksheetName 'Hoja1' -NoHeader | Select-Object -Skip 1
} catch {
    Fail "Error al leer ${ExcelPath}: $($_.Exception.Message)"
}

$idxInventario = 0..($headers.Count - 1) | Where-Object { $headers[$_] -like '*Inventario*' } | Select-Object -First 1
$idxTitulo = 0..($headers.Count - 1) | Where-Object { $headers[$_] -like '*tulo*' } | Select-Object -First 1
$idxAutor = 0..($headers.Count - 1) | Where-Object { $headers[$_] -like '*Autor*' } | Select-Object -First 1

if ($null -eq $idxInventario -or $null -eq $idxTitulo -or $null -eq $idxAutor) {
    Fail "No se encontraron las columnas de N de Inventario / Titulo / Autor en ${ExcelPath}"
}

$existentes = [System.Collections.Generic.HashSet[string]]::new(
    [string[]]($filasExistentes | ForEach-Object { "$($_."P$($idxInventario + 1)")".Trim() })
)

$nuevas = @()
foreach ($fila in $csv) {
    $nro = "$($fila.NroInventario)".Trim()
    $titulo = "$($fila.Titulo)".Trim()
    if ([string]::IsNullOrWhiteSpace($nro) -or [string]::IsNullOrWhiteSpace($titulo)) { continue }
    if ($existentes.Contains($nro)) { continue }

    $filaOrdenada = [ordered]@{}
    for ($i = 0; $i -lt $headers.Count; $i++) { $filaOrdenada[$headers[$i]] = '' }
    $filaOrdenada[$headers[$idxInventario]] = $nro
    $filaOrdenada[$headers[$idxTitulo]] = $titulo
    $filaOrdenada[$headers[$idxAutor]] = "$($fila.Autor)".Trim()
    $nuevas += [PSCustomObject]$filaOrdenada

    $existentes.Add($nro) | Out-Null
}

if ($nuevas.Count -eq 0) {
    Write-Output 0
    exit 0
}

[array]::Reverse($nuevas)

try {
    $nuevas | Export-Excel -Path $ExcelPath -WorksheetName 'Hoja1' -Append
} catch {
    Fail "Error al guardar ${ExcelPath}: $($_.Exception.Message)"
}

Write-Output $nuevas.Count
exit 0
