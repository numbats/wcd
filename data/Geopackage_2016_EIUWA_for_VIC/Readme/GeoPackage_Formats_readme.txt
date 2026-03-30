# ABS GeoPackages

ABS GeoPackages are suitable for experienced Census data users who have their own Geospatial information systems. GeoPackages contain data for the main Census characteristics of people, families and dwellings for geographic areas ranging from a single Statistical Area Level 1 to the whole of Australia. Use GeoPackages if you want Community Profile data for numerous geographic areas.

GeoPackages are Census data linked together with the ASGS boundaries in an SQLite container that can be easily used.  They are formatted in a standards based format gpkg which is in an open format, that is supported by commonly used software systems. 

Metadata files contain the information you need to match the data with the Community Profile template, such as information about the sequential numbers and labels, the digital boundaries, the table descriptors, and the population that is being counted.

## About GeoPackage Formats

ABS produces GeoPackages for the General Community Profile in an  archive (.gpkg) format. 
Note:

* Microsoft Excel or equivalent spreadsheet software is required to open .xlsx files.
* Markdown(.md) readme files can be viewed in any text editor or web browser.
ABS produces DataPacks in two container formats - a traditional compressed archive (.zip), and the newer GeoPackage format (.gpkg), which is a container format specifically designed for holding, viewing and transporting multiple spatial layers and data as a single "file", and may be more suitable for those using a modern GIS system for analysis rather than non-spatial analysis tool such as SAS.


### 1.  GeoPackages (.gpkg)

ABS GeoPackage compressed files contain:
* AboutGeopackage_readme.txt - "Read Me" documentation containing helpful information for users about the data and how it is structured (.txt)
* GeoPackage_Formats_readme.txt which contains details about basic structure formats and contents of GeoPackages
* Sequential template files (.xlsx) containing the information about the Community Profile template, such as information about the sequential numbers and data labels, the table descriptions, and the population that is being counted
* Metadata file (.xlsx) containing information on the table numbers, names, populations and cell descriptor information
* DataPack to GeoPackage Lookup (.csv) contains a DataPack to GeoPackage reference list, including the renamed list of short headers within tables to enable table and boundaries to merge.
* 2016 Geography descriptor file (.xlsx) which lists all geographies used in DataPacks by level, code, label and Area sqkm.
* Creative Commons Licensing information (.txt)
* A GeoPackage file - Census data merged with boundary information (.gpkg)

## What is a GeoPackage?
[Open Geospatial Consortium (OGC)](http://www.opengeospatial.org/) GeoPackage (GPKG) is an open, non-proprietary, platform-independent and standards-based data format for geographic information system implemented as a SQLite database container. Originally designed to meet mobile geospatial needs, it is rapidly becoming a preferred means for exchanging geospatial datasets and the associated base maps and layers as a single ready-to-use file.

GeoPackage is based on a technology called [SQLite](https://sqlite.org/), which is a lightweight, public domain database system. If you know SQLite, then you are most of the way to understanding GeoPackage. Most modern Geographical Information systems and tools (for example: MapInfo, ArcMap, QGIS, FME and others) are starting to support GeoPackage natively, making it a powerful and widely adopted geospatial data interchange format.

Further information on the specification for GeoPackage can be found on the following website http://www.GeoPackage.org/ , including implementations and examples.

Some advantages of GeoPackage are:

* It is backed by the OGC (http://www.opengeospatial.org/) - the international standards organisation for geospatial information and systems.
* It can hold and transport multiple spatial layers as a self-contained, single file container. 
* It is based on an open and widely supported database format, allowing SQL querying of the data.
* Data can be added and removed from a GeoPackage.
* The file format is vendor agnostic. QGIS, FME and others) are starting to support GeoPackage natively, making it a powerful and widely adopted geospatial data interchange format.