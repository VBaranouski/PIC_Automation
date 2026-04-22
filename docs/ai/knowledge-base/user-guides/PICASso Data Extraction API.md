Data Extraction API

# Revision History

|  |  |  |  |
|:--:|:--:|:--:|:--:|
| **Version** | **Date** | **Modified By** | **Description of Change** |
| 1.0 | 29-Jan-2026 | Maryna Shykova | Guideline document – PICASso Phase 1 |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

# Table of Contents

[Revision History [1](#revision-history)](#revision-history)

[Table of Contents [3](#table-of-contents)](#table-of-contents)

[1. Purpose [3](#purpose)](#purpose)

[2. Authentication for different cases [4](#authentication-for-different-cases)](#authentication-for-different-cases)

[3. API Documentation [4](#api-documentation)](#api-documentation)

[4. How to start using the Data Extraction API [5](#how-to-start-using-the-data-extraction-api)](#how-to-start-using-the-data-extraction-api)

[5. How to use the API – system to system [6](#how-to-use-the-api-system-to-system)](#how-to-use-the-api-system-to-system)

[6. How to use the API – user to system (not PowerQuery) [6](#how-to-use-the-api-user-to-system-not-powerquery)](#how-to-use-the-api-user-to-system-not-powerquery)

[7. How to use the API – user to system (PowerQuery specific) [7](#how-to-use-the-api-user-to-system-powerquery-specific)](#how-to-use-the-api-user-to-system-powerquery-specific)

# Purpose

One of the key features identified to enrich GRC PICASso was the ability to extract the data available in PICASso for reporting purposes, metrics calculations, progress monitoring and strategic decisions. The data can be exported from the Staging Area DB synced with the main DB on the daily basis (at night) using the set of API requests.

# Authentication for different cases

Data Extraction API is designed to securely extract (read) data from PICASso which can be managed in the following ways:

- System to system - other tool get data from PICASso to use it for reports creation, analysis or further editing actions. No user is involved in the process of getting data, authorization is managed with the client's credentials.

<img src="/media/image9.png" style="width:6.69792in;height:3.69792in" />

- User to system, which can have the following variations:

  - Authorised user of another tool get data from PICASso to use it for reports creation, analysis or further editing actions. User is involved in the process and authorise him/herself in this other tool with PingID (receiving user token) to get data from PICASso. Access is restricted for specific user (one user per one tool).

  - User of PICAsso get data from PICASso using PowerQuery for reports creation and analysis. For authorization, such user has to create refresh token in PICASso UI and use this generated token to call Data Extraction API. Access is restricted for specific user and specific Client ID from Azure.  
    Note: When the request to use Data Extraction API is created, PICASso team will request creation of the tool for the user in Azure AD/Entra ID.

# API Documentation

The Data Extraction API allows reading products, releases and actions related data from PICASso. The data is consumed from the StagingArea DB, which is synced with PICASso DB every night. The data updated in PICASso today, would be available via these API tomorrow.

The complete list of available Data Extraction API calls can be found by the following links:

PPR: <https://ppr.leap.schneider-electric.com/GRC_API/rest/v2/>

Prod: <https://leap.schneider-electric.com/GRC_API/rest/v2/>

# How to start using the Data Extraction API

To start using the Data Extraction API functionality, the following steps to be completed:

1\) Register the application that needs to be connected with PICASso in Azure AD (Entra ID) using the following form:

<https://schneider.service-now.com/supportatschneider?id=sc_cat_item&sys_id=c49a155a1b26b490dd1199bd2e4bcba0&table=sc_cat_item&searchTerm=Microsoft%20Azure%20Request>

Note: 1) for user to system methods – each person has to have own tool created in Azure AD (Entra ID).  
2) for PowerQuery specific access – the request for client creation in Azure would be managed by the PICASso support team based on the request to access.

2\) Provide the Client ID received from Azure AD/Entra ID to PICASso team via ServiceNow request form (use the following link: <https://schneider.service-now.com/supportatschneider?id=sc_cat_item&sys_id=0f0a231a93118650a067bd158aba10d1&table=sc_cat_item>) and specify:

- User of the tool (for user to system method only).

- Level of access that should be granted for this tool/user (e.g., data for specific BU, Division, LoB or the set of Products).

3\) PICASso team will register an External Tool for this tool and link it with a corresponding scope (organization or specific products).

System-to-system connection:

<img src="/media/imagea.png" style="width:6.69792in;height:2.1875in" />User-to-system connection:

<img src="/media/imagec.png" style="width:6.69792in;height:2.27083in" />

# How to use the API – system to system

To use the API, the tool would need to follow the next steps:

1\) To receive the JWT token call /token endpoint (POST call to: [https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token)](https://login.microsoftonline.com/%7Btenant%7D/oauth2/v2.0/token) with the following details:

| **Field** | **Data** |
|:---|:---|
| grant_type | client_credentials |
| scope | application value provided by Azure AD in the format “\<app id\>/.default” |
| client_id | Unique client ID provided by Azure AD |
| client_secret | Unique client secret provided by Azure AD |

2\) Calling PICASso API (see section API Documentation), the client sends the access token in the Authorization header.

3\) PICASso validates this provided token, check the data which is available for the reading for this external tool (see section How to start using the Data Ingestion API) and allows (if all the checks are passed) requesting the data with this API endpoint.

# 6. How to use the API – user to system (not PowerQuery)

To use the API, the tool and its user would need to follow the next steps:

1\) The consumer application (i.e., the client integrating with PICASso API) begins by constructing an authorization URL using the following format:

<https://login.microsoftonline.com/%7BTenantId%7D/oauth2/v2.0/authorize>?  
client_id={ClientId}  
&response_type=code  
&redirect_uri={RedirectUri}  
&response_mode=query  
&scope={Scope}

**Key Parameters:**

- **ClientId** – Provided by Azure AD to the consumer application.

- **RedirectUri** – The endpoint where Azure AD will send the authorization code after successful login (to be configured by the clients themselves)

- **Scope** – Specifies the permissions the application is requesting.

2\) When the user accesses the above redirect URL, they are redirected to PingID for authentication. They will log in using their SESA ID and password. Upon successful authentication, Azure AD will redirect the user to the specified RedirectUrL, along with an **authorization code**.

3\) The consumer application then uses the authorization code to request an access token by making a POST request to: <https://login.microsoftonline.com/%7BTenantId%7D/oauth2/v2.0/token> with the following details:

| **Field**     | **Data**                                               |
|:--------------|:-------------------------------------------------------|
| grant_type    | authorization_code                                     |
| client_id     | Unique client ID provided by Azure AD                  |
| code          | The authorization code received from Azure AD          |
| redirect_uri  | Must match the one used earlier for validation purpose |
| scope         | application value provided by Azure AD                 |
| client_secret | Unique client secret provided by Azure AD              |

4\) Calling PICASso API (see section API Documentation), the client sends the access token in the Authorization header.

5\) PICASso validates this provided token, check the data which is available for the reading for this external tool (see section How to start using the Data Ingestion API) and allows (if all the checks are passed) requesting the data with this API endpoint.

# 7. How to use the API – user to system (PowerQuery specific)

To connect PowerQuery in Microsoft Excel to PICASso using a secure Refresh Token mechanism the following steps to be used.

Part 1: Azure Portal Configuration:  
  
***Note: Client creation in Azure and its configuration would be completed by PICASso support team when the request to use Data Extraction API with PowerQuery is created by the user. So, the below steps would be covered by the support team as well.***

Part 2: First-time Excel Configuration:

Note: 1) You only need to perform these steps once on your computer to prevent Power Query privacy firewall errors.  
2) Application must be registered in Azure and then the client id must be added to Picasso back office with the user details (see section How to start using the Data Extraction API above for details).

1)  Ignore Privacy Settings

    1.  Open Excel and go to the Data tab in the ribbon.

    2.  Click Get Data \> Query Options.

    3.  In the Global section (left sidebar), select Privacy.

    4.  Choose the option: "Always ignore privacy level setting."

    5.  Click OK.

2)  Clear Global Permissions

    1.  Go to the Data tab.

    2.  Click Get Data \> Data Source Settings.

    3.  Select Global Permissions.

    4.  Click Clear All Permissions.

    5.  Click Close.

Part 3: Token Generation & Local Storage

1)  Generate the Refresh Token in PICASso:

    1.  Navigate to the Token Generation page in PICASso by clicking on the “PAT” link in the header.  
        Note: the link is visible only after the user is added by the PICASso team as Data Extraction API user

<img src="/media/imaged.png" style="width:6.69792in;height:1.21875in" />

2.  Click the Create Token button on the opened page:

<img src="/media/imagee.png" style="width:6.69792in;height:1.53125in" />

3.  You will be redirected to the Microsoft Login page.  
    Note: If you are already logged in via SSO, this step will happen automatically.

4.  Once authenticated, you will be redirected back to the Personal Access Token page with opened “Created Token” popup with Encrypted Refresh Token shown on it. Click the Copy link to copy the token to your clipboard (or select and copy the token manually).

<img src="/media/imagef.png" style="width:5.20833in;height:2.53125in" />

2)  Save Token Locally - the Power Query script would be targeted to use this token from a specific location on your machine.

    1.  Navigate to your Documents folder: C:\Users\\your SESAId\>\Documents\\

    2.  Create a new folder named Token.

    3.  Inside that folder, create a new text file named AccessToken.txt.

    4.  Paste the token you copied in the previous step into this file.

    5.  Save and close the file.

    6.  Make sure to update your file path in Power Query (M) mentioned below  
        Final Path Example: C:\Users\sesa123456\Documents\Token\AccessToken.txt

Part 4: PowerQuery (M) Setup

> Create the Function:

1.  In Excel, go to Data \> Get Data \> From Other Sources \> Blank Query.

2.  In the Power Query Editor, click Advanced Editor (Home tab).

3.  Delete any existing code and paste the code from the following link (see **Code snippet** below).  
    IMPORTANT: Update the TokenPath variable in the code below to match your specific SESA ID and path of the access token location (from the previous step) and update the Base URL in the code to match the environment used (ppr.leap - for PPR, leap – for Prod)

4.  Click Done.

5.  Rename the query (on the right side) to fxCallAPIUsingRefreshToken.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr>
<th><p><strong>Code snippet</strong></p>
<p>// fxCallAPIUsingRefreshToken</p>
<p>let</p>
<p>fxCallAPIUsingRefreshToken = (ApiPath as text, Method as text, optional Body as nullable text) =&gt;</p>
<p>let</p>
<p>//----------------------------------------</p>
<p>// STEP 1: Read &amp; Clean Token from File</p>
<p>//----------------------------------------</p>
<p>// 1. Point to your specific file path</p>
<p>TokenPath = "C:\Users\Anastasiia_Akinfiiev\OneDrive - Schneider Electric\Documents\Token\AccessToken.txt",</p>
<p>// 2. Read file AND remove hidden spaces/newlines (CRITICAL FIX)</p>
<p>// If we don't use Text.Trim, the token includes an "Enter" key and fails the database lookup.</p>
<p>GuidValue = Text.Trim(Text.FromBinary(File.Contents(TokenPath))),</p>
<p>//----------------------------------------</p>
<p>// STEP 2: Create JSON Body for OutSystems</p>
<p>//----------------------------------------</p>
<p>// 3. Build the JSON object automatically.</p>
<p>// This produces: {"RefreshToken": "your-guid-value"}</p>
<p>// This is perfect for your JSON Deserialize widget.</p>
<p>ExecBinary = Json.FromValue([RefreshToken = GuidValue]),</p>
<p>// 4. Parse the response to extract the new Bearer Token</p>
<p>// ExecJson = Json.Document(ExecResponse),</p>
<p>// AccessToken = ExecJson[Token],</p>
<p>//----------------------------------------</p>
<p>// STEP 4: Build correct API URL (OrdersAPI)</p>
<p>//----------------------------------------</p>
<p>Url = "<a href="https://leap.schneider-electric.com/GRC_API/rest/v2/">https://leap.schneider-electric.com/GRC_API/rest/v2/</a>" &amp; ApiPath,</p>
<p>//----------------------------------------</p>
<p>// STEP 5: Build request options</p>
<p>//----------------------------------------</p>
<p>Options =</p>
<p>if Text.Upper(Method) = "GET" then</p>
<p>[</p>
<p>Headers = [</p>
<p>Accept = "application/json",</p>
<p>PAT=GuidValue</p>
<p>]</p>
<p>]</p>
<p>else</p>
<p>[</p>
<p>Headers = [</p>
<p>#"Content-Type" = "application/json",</p>
<p>Accept = "application/json",</p>
<p>PAT=GuidValue</p>
<p>],</p>
<p>Content = Text.ToBinary( if Body = null then "" else Body )</p>
<p>],</p>
<p>//----------------------------------------</p>
<p>// STEP 6: Call final API &amp; Format Output</p>
<p>//----------------------------------------</p>
<p>RawResponse = Web.Contents(Url, Options),</p>
<p>RawText = Text.FromBinary(RawResponse),</p>
<p>ParsedJson = try Json.Document(RawText) otherwise RawText,</p>
<p>Output =</p>
<p>if Value.Is(ParsedJson, type list) then</p>
<p>Table.FromRecords(ParsedJson)</p>
<p>else if Value.Is(ParsedJson, type record) then</p>
<p>Record.ToTable(ParsedJson)</p>
<p>else</p>
<p>#table({"Value"}, {{ParsedJson}})</p>
<p>in</p>
<p>Output</p>
<p>in</p>
<p>fxCallAPIUsingRefreshToken</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Part 5: Use the API:

1)  Calling PICASso API (see section API Documentation), user needs to invoke the function above to authorize.

2)  PICASso validates this provided refresh token, check the data which is available for the reading for this external tool (see section How to start using the Data Ingestion API) and allows (if all the checks are passed) requesting the data with this API endpoint.
