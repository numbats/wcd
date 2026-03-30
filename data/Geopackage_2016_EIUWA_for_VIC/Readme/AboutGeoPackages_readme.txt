# About GeoPackages
GeoPackages contain data for Census geographical areas ranging from Statistical Area Level 1 to the whole of Australia. They include metadata and reference documents to enable you to use and read the data.

Metadata files contain the information you need to match the data with the Community Profile template, such as information about sequential numbers and labels, digital boundaries, table descriptors, and the population that is being counted. The Metadata folder also contains the geographical description file: 2016Census_geog_desc_1st_2nd_3rd_release.xlsx

GeoPackages do not include software.

# Using the GeoPackages
You can use GeoPackages if you:

•	want to use the data with your own database or analysis systems
•	want Community Profile data for numerous geographic areas.

# Descriptors

Short descriptors were created for use with Geographic Information System (GIS) software. Short descriptors (up to 29 characters) are available in the data. 
Should you require the long or sequential descriptors, you can find the corresponding information in the Metadata file contained in the zip file. For example the Metadata_2016_GCP_DataPack contains a listing of all sequential, short and long descriptor information. 

Some fields in GeoPackages have been modified from the original Census DataPack short headers to enable information grouping. For example Tot_Tot exists in different community profile tables (G26 & G28) within the GeoPackage SFC. To enable their coexistence in GeoPackage SFC, the fields have been renamed to Tot_Tot_G26 & Tot_Tot_G28. Included in each GeoPackage zip file is a DataPack_to_GeoPackage_Lookup csv file to enable referencing between the DataPack and GeoPackage metadata.


# GeoPackage Geographies
GeoPackages are available to download from our website. When you download a GeoPackages, you will choose the Geography regions, Community Profile topic and topic tables

# Availability of geographic structures
The following tables show the availability of data for each geographic area, for the first, second and third releases.

Legend: 1 = GeoPackage first release data, 2 = GeoPackage second release data, 3 = GeoPackage third release data
Abbreviations for geographic structures are listed after the tables.

+---------------------------+------+-----+-----+-----+-----+-----+-------+------+------+------+-----+------+-----+------+----+
| Geography: ABS structures |      |     |     |     |     |     |       |      |      |      |     |      |     |      |    |
+---------------------------+------+-----+-----+-----+-----+-----+-------+------+------+------+-----+------+-----+------+----+
| GeoPackage                | Aust | STE | SA4 | SA3 | SA2 | SA1 | GCCSA | IREG | IARE | ILOC | SUA | UC/L | SOS | SOSR | RA |
| GCP                       | 1    | 1   | 1   | 1   | 1   | 1   | 1     |      |      |      | 2   | 2    | 2   | 2    | 3  |
+---------------------------+------+-----+-----+-----+-----+-----+-------+------+------+------+-----+------+-----+------+----+

+-------------------------------+-----+-----+-----+-----+-----+
| Geography: Non-ABS structures |     |     |     |     |     |
+-------------------------------+-----+-----+-----+-----+-----+
| GeoPackage                    | LGA | SSC | POA | CED | SED |
| GCP                           | 1   | 1   | 1   | 1   | 1   |
+-------------------------------+-----+-----+-----+-----+-----+

+---------------+----------------------------------------+
| Abbreviations |                                        |
+---------------+----------------------------------------+
| Aust          | Australia                              |
| CED           | Commonwealth Electoral Divisions       |
| GCCSA         | Greater Capital City Statistical Areas |
| IARE          | Indigenous Areas                       |
| ILOC          | Indigenous Locations                   |
| IREG          | Indigenous Regions                     |
| LGA           | Local Government Areas                 |
| POA           | Postal Areas                           |
| RA            | Remoteness Areas                       |
| SA1           | Statistical Area Level 1               |
| SA2           | Statistical Area Level 2               |
| SA3           | Statistical Area Level 3               |
| SA4           | Statistical Area Level 4               |
| SED           | State Electoral Divisions              |
| SOS           | Section of State                       |
| SOSR          | Section of State Ranges                |
| SSC           | State Suburbs                          |
| STE           | States and Territories                 |
| SUA           | Significant Urban Areas                |
| UC/L          | Urban Centres and Localities           |
+---------------+----------------------------------------+

# Summary of Community Profiles

The community profiles are released in two phases. First release tables are those containing variables which are relatively easy to process and will be available on release day. Second release tables will contain variables which require more complex processing and will be available on the second release day.
Basis for counting people
•	'Place of usual residence' data counts people where they usually live.
•	'Place of enumeration' is the place at which the person is counted i.e. where he/she spent Census Night, which may not be where he/she usually lives. 
•	'Place of work' data provides information on where a person goes to work.

# Additivity of data
Please note that there are small random adjustments made to all cell values to protect the confidentiality of data. These adjustments may cause the sum of rows or columns to differ by small amounts from the table totals.

# Templates
The templates provide an easy way for you to visualise all data cells available in the data files. They contain the formatted tables and the corresponding cell reference numbers. The templates are in the Metadata folder.

# Community Profile	Template
• GCP	2016_GCP_Sequential_Template.xlsx

# GeoPackage topics and mapping to Community Profiles

General Community Profile (GCP)
•	The GCP contains the Census characteristics on persons, families and dwellings.
•	The data is based on a combination place of usual residence and place of enumeration.
•	Tables G01-G39 were released on 12 July 2017. Tables G40-G59 were released on 10 November 2017.

Mapping GeoPackages to Community Profiles
+-------------------------------------------------+------------+----------------------------------------------------+-----------------------------------------------------------------------------------------------+
|                    Category                     | GeoPackage |               DataPack CSVs Included               |                                     Table Names included                                      |
+-------------------------------------------------+------------+----------------------------------------------------+-----------------------------------------------------------------------------------------------+
| Aboriginal and Torres Strait Islander Peoples   | ATSIP      | G01, G07                                           | G01 - Selected Person Characteristics by Sex                                                  |
|                                                 |            |                                                    | G07 - Indigenous Status by Age by Sex                                                         |
| Children and Childcare                          | CCA        | G12A, G12B, G22A, G22B                             | G12 - Proficiency in Spoken English/Language of Parents by Age of Dependent Children          |
|                                                 |            |                                                    | G22 - Unpaid Child Care by Age by Sex                                                         |
|                                                 | CCB        | G24, G55A, G55B, G56A, G56B                        | G24 - Number of Children Ever Born                                                            |
|                                                 |            |                                                    | G55 - Total Family Income (weekly) by Labour Force Status of Parents/Partners for Couple Families with Children |
|                                                 |            |                                                    | G56 - Total Family Income (weekly) by Labour Force Status of Parent for One Parent Families   |
|                                                 | CCC        | G44A, G44B, G44C, G44D                             | G44 - Labour Force Status by Sex of Parents by Age of Dependent Children for Couple Families (part 1) |
|                                                 | CCD        | G44E, G44F, G45A, G45B                             | G44 - Labour Force Status by Sex of Parents by Age of Dependent Children for Couple Families (part 2) |
|                                                 |            |                                                    | G45 - Labour Force Status by Sex of Parent by Age of Dependent Children for One Parent Families |
| Cultural and Language Diversity                 | CLDA       | G01, G07, G08                                      | G01 - Selected Person Characteristics by Sex                                                  |
|                                                 |            |                                                    | G07 - Indigenous Status by Age by Sex                                                         |
|                                                 |            |                                                    | G08 - Ancestry by Country of Birth of Parents                                                 |
|                                                 | CLDB       | G09A, G09B, G09C, G09D                             | G09 - Country of Birth of Person by Age by Sex (part 1)                                       |
|                                                 | CLDC       | G09E, G09F, G09G, G09H                             | G09 - Country of Birth of Person by Age by Sex (part 2)                                       |
|                                                 | CLDD       | G10A, G10B, G10C                                   | G10 - Country of Birth of Person by Year of Arrival in Australia                              |
|                                                 | CLDE       | G11A, G11B, G11C, G11D                             | G11 - Proficiency in Spoken English/Language by Year of Arrival in Australia by Age           |
|                                                 | CLDF       | G12A, G12B                                         | G12 - Proficiency in Spoken English/Language of Parents by Age of Dependent Children          |
|                                                 | CLDG       | G13A, G13B, G13C, G13D                             | G13 - Language Spoken at Home by Proficiency in Spoken English/Language by Sex                |
|                                                 | CLDH       | G14, G26                                           | G14 - Religious Affiliation by Sex                                                            |
|                                                 |            |                                                    | G26 - Family Composition and Country of Birth of Parents by Age of Dependent Children         |
| Disability, Need for Assistance and Carers      | DNAC       | G18, G21, G22A, G22B                               | G18 - Core Activity Need for Assistance by Age by Sex                                         |
|                                                 |            |                                                    | G21 - Unpaid Assistance to a Person with a Disability by Age by Sex                           |
|                                                 |            |                                                    | G22 - Unpaid Child Care by Age by Sex                                                         |
| Education and Qualifications                    | EQA        | G15, G16A, G16B, G40, G46A, G46B                   | G15 - Type of Educational Institution Attending (Full/Part-Time Student Status by Age) by Sex |
|                                                 |            |                                                    | G16 - Highest Year of School Completed by Age by Sex                                          |
|                                                 |            |                                                    | G40 - Selected Labour Force, Education and Migration Characteristics by Sex                   |
|                                                 |            |                                                    | G46 - Non-School Qualification: Level of Education by Age by Sex                              |
|                                                 | EQB        | G47A, G47B, G47C, G48A, G48B, G48C                 | G47 - Non-School Qualification: Field of Study by Age by Sex                                  |
|                                                 |            |                                                    | G48 - Non-School Qualification: Field of Study by Occupation by Sex                           |
|                                                 | EQC        | G49A, G49B, G49C, G50A, G50B, G50C                 | G49 - Non-School Qualification: Level of Education by Occupation by Sex                       |
|                                                 |            |                                                    | G50 - Non-School Qualification: Level of Education by Industry of Employment by Sex           |
| Employment, Income and Unpaid Work              | EIUWA      | G02, G17A, G17B, G17C                              | G02 - Selected Medians and Averages                                                           |
|                                                 |            |                                                    | G17 - Total Personal Income (weekly) by Age by Sex                                            |
|                                                 | EIUWB      | G19, G20A, G20B, G21, G22A, G22B                   | G19 - Voluntary Work for an Organisation or Group by Age by Sex                               |
|                                                 |            |                                                    | G20 - Unpaid Domestic Work: Number of Hours by Age by Sex                                     |
|                                                 |            |                                                    | G21 - Unpaid Assistance to a Person with a Disability by Age by Sex                           |
|                                                 |            |                                                    | G22 - Unpaid Child Care by Age by Sex                                                         |
|                                                 | EIUWC      | G40, G43A, G43B                                    | G40 - Selected Labour Force, Education and Migration Characteristics by Sex                   |
|                                                 |            |                                                    | G43 - Labour Force Status by Age by Sex                                                       |
|                                                 | EIUWD      | G44A, G44B, G44C, G44D                             | G44 - Labour Force Status by Sex of Parents by Age of Dependent Children for Couple Families (part 1) |
|                                                 | EIUWE      | G44E, G44F, G45A, G45B                             | G44 - Labour Force Status by Sex of Parents by Age of Dependent Children for Couple Families (part 2) |
|                                                 |            |                                                    | G45 - Labour Force Status by Sex of Parent by Age of Dependent Children for One Parent Families |
|                                                 | EIUWF      | G48A, G48B, G48C, G49A, G49B, G49C                 | G48 - Non-School Qualification: Field of Study by Occupation by Sex                           |
|                                                 |            |                                                    | G49 - Non-School Qualification: Level of Education by Occupation by Sex                       |
|                                                 | EIUWG      | G50A, G50B, G50C                                   | G50 - Non-School Qualification: Level of Education by Industry of Employment by Sex           |
|                                                 | EIUWH      | G51A, G51B, G51C, G51D                             | G51 - Industry of Employment by Age by Sex                                                    |
|                                                 | EIUWI      | G52A, G52B, G52C, G52D, G53A, G53B                 | G52 - Industry of Employment by Hours Worked by Sex                                           |
|                                                 |            |                                                    | G53 - Industry of Employment by Occupation                                                    |
|                                                 | EIUWJ      | G54A, G54B, G55A, G55B, G56A, G56B                 | G54 - Total Family Income (weekly) by Labour Force Status of Partners for Couple Families with no Children |
|                                                 |            |                                                    | G55 - Total Family Income (weekly) by Labour Force Status of Parents/Partners for Couple Families with Children |
|                                                 |            |                                                    | G56 - Total Family Income (weekly) by Labour Force Status of Parent for One Parent Families   |
|                                                 | EIUWK      | G57A, G57B, G58A, G58B, G59                        | G57 - Occupation by Age by Sex                                                                |
|                                                 |            |                                                    | G58 - Occupation by Hours Worked by Sex                                                       |
|                                                 |            |                                                    | G59 - Method of Travel to Work by Sex                                                         |
| Household Income and Housing Costs              | HIHC       | G02, G28, G29, G34, G35, G36                       | G02 - Selected Medians and Averages                                                           |
|                                                 |            |                                                    | G28 - Total Family Income (weekly) by Family Composition                                      |
|                                                 |            |                                                    | G29 - Total Household Income (weekly) by Household Composition                                |
|                                                 |            |                                                    | G34 - Mortgage Repayment (monthly) by Dwelling Structure                                      |
|                                                 |            |                                                    | G35 - Mortgage Repayment (monthly) by Family Composition                                      |
|                                                 |            |                                                    | G36 - Rent (weekly) by Landlord Type                                                          |
| Selected Dwelling and Household Characteristics | SDHCA      | G02, G23A, G23B, G29, G30, G31, G32, G33, G34, G35 | G02 - Selected Medians and Averages                                                           |
|                                                 |            |                                                    | G23 - Relationship in Household by Age by Sex                                                 |
|                                                 |            |                                                    | G29 - Total Household Income (weekly) by Household Composition                                |
|                                                 |            |                                                    | G30 - Number of Motor Vehicles by Dwellings                                                   |
|                                                 |            |                                                    | G31 - Household Composition by Number of Persons Usually Resident                             |
|                                                 |            |                                                    | G32 - Dwelling Structure                                                                      |
|                                                 |            |                                                    | G33 - Tenure and Landlord Type by Dwelling Structure                                          |
|                                                 |            |                                                    | G34 - Mortgage Repayment (monthly) by Dwelling Structure                                      |
|                                                 |            |                                                    | G35 - Mortgage Repayment (monthly) by Family Composition                                      |
|                                                 | SDHCB      | G36, G37, G38, G39                                 | G36 - Rent (weekly) by Landlord Type                                                          |
|                                                 |            |                                                    | G37 - Dwelling Internet Connection by Dwelling Structure                                      |
|                                                 |            |                                                    | G38 - Dwelling Structure by Number of Bedrooms                                                |
|                                                 |            |                                                    | G39 - Dwelling Structure by Household Composition and Family Composition                      |
| Selected Family Characteristics                 | SFC        | G02, G25, G26, G27, G28                            | G02 - Selected Medians and Averages                                                           |
|                                                 |            |                                                    | G25 - Family Composition                                                                      |
|                                                 |            |                                                    | G26 - Family Composition and Country of Birth of Parents by Age of Dependent Children         |
|                                                 |            |                                                    | G27 - Family Blending                                                                         |
|                                                 |            |                                                    | G28 - Total Family Income (weekly) by Family Composition                                      |
| Selected Person Characteristics                 | SPCA       | G01, G02, G03, G04A, G04B, G05, G06                | G01 - Selected Person Characteristics by Sex                                                  |
|                                                 |            |                                                    | G02 - Selected Medians and Averages                                                           |
|                                                 |            |                                                    | G03 - Place of Usual Residence on Census Night by Age                                         |
|                                                 |            |                                                    | G04 - Age by Sex                                                                              |
|                                                 |            |                                                    | G05 - Registered Marital Status by Age by Sex                                                 |
|                                                 |            |                                                    | G06 - Social Marital Status by Age by Sex                                                     |
|                                                 | SPCB       | G23A, G23B, G24                                    | G23 - Relationship in Household by Age by Sex                                                 |
|                                                 |            |                                                    | G24 - Number of Children Ever Born                                                            |
| Usual Address and Internal Migration*           | UAIM       | G03, G40, G41, G42                                 | G03 - Place of Usual Residence on Census Night by Age                                         |
|                                                 |            |                                                    | G40 - Selected Labour Force, Education and Migration Characteristics by Sex                   |
|                                                 |            |                                                    | G41 - Place of Usual Residence 1 Year Ago by Sex                                              |
|                                                 |            |                                                    | G42 - Place of Usual Residence 5 Years Ago by Sex                                             |
+-------------------------------------------------+------------+----------------------------------------------------+-----------------------------------------------------------------------------------------------+



# Assistance
Customised Data and Information (CDI) 
CDI consultants have been trained in the range of statistical data and information that is produced by the Australian Bureau of Statistics (ABS). For straightforward enquiries, we are able to provide limited free data and information to you over the phone. For complex or wide-ranging enquiries about ABS data, we can assist you to find what you need, using resources available through this web site. In some instances, data may need to be compiled for you on a fee-for-service basis.

Customised Data and Information (CDI) Ph: 1300 135 070.
