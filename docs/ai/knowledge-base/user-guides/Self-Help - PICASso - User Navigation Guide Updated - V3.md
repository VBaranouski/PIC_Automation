**PICASso (Product Internal Controls Assurance Security) Tool**

**SUMMARY**

One-stop shop that assists teams to fulfil the needs of SDL and functional requirements' elicitation (EasyRQ), integration, and workflows to make the experience more efficient and more effective and Manage risks by Improving governance, evidence, auditing, traceability and metric collection at the same time.

**CONTENT**

1.  [Introduction](#introduction)

2.  [User Navigation](#user-navigation)

    1.  [Authentication & Authorization](#authentication-authorization)

    2.  [Landing Page Overview](#landing-page-overview)

        1.  [My Tasks](#my-tasks)

        2.  [My Products](#my-products)

        3.  [My Releases](#my-releases)

        4.  [Reports & Dashboards](#Reports_and_Dashboards)

    3.  [New Product Creation](#new-product-creation)

    4.  [Product View](#product-view)

    5.  [Product Update](#product-update)

        1.  [Product details update](#product-details-update)

        2.  [Status Mapping Configuration](#status-mapping-configuration)

    6.  [Release Management](#release-management)

        1.  [Release Workflow](#release-workflow)

        2.  [Create & Scope](#create-scope)

        3.  [Review & Confirm](#review-confirm)

        4.  [Manage](#manage)

        5.  [FCSR Review](#fcsr-recommendation)

        6.  [Release Submit for SA & PQL Sign Off](#release-submit-for-sa-pql-sign-off)

        7.  [SA & PQL Sign Off](#sa-pql-sign-off)

        8.  [FCSR Decision](#fcsr-decision)

        9.  [Post FCSR Actions](#post-fcsr-actions)

        10. [Final Acceptance](#final-acceptance)

    7.  [Email notifications](#email-notifications)

    8.  [Release History](#release-history)

    9.  [Stage Responsibles Side Bar](#stage-responsibles-side-bar)

    10. [Maintenance and Informative/Warning Banners](#maintenance-and-informativewarning-banner)

    11. [Actions Summary](#actions-management)

    12. [Tooltips Across the PICASso System](#Bookmark21)

    13. [Workflow Delegation](#workflow-delegation)

## INTRODUCTION

The purpose of this document is to establish the Roles and Responsibilities of each user, how a user can request access and navigate the tool.

### 1.1 Purpose of PICASso

The primary objective of the new solution, Product Internal Control Assurance Security (PICASso), is to facilitate the comprehensive integration of cybersecurity practices and security and privacy requirements into the product development lifecycle. Its role extends to mandating their execution and offering cybersecurity and privacy governance and oversight across all business units, lines of business, and product teams.

For the purposes of this document, “product” refers to any development being performed for use inside or outside the company. For example, a product may be something developed for sale to an external customer, or by an internal customer such as Human Resources. Likewise, the term “customer” refers to the entity for which the work is being performed, either internal or external.

### 1.2 Scope

The PICASso functional requirements include the following items:

Use cases for:

- Product creation and update,

- Release creation and update,

- SDL Process Requirements Management

- Product Requirements Management

- Data Protection and Privacy Review

- System Design Details

- Threat Model Details

- 3rd-Party Suppliers & SE Bricks Details

- Static Code Analysis Details

- 3rd-Party & OSS Vulnerabilities Details

- FOSS Check Details

- V&V Testing Details

- Pen Test Details

- Ext. Vulnerabilities Details

- Action Management

- Formal Cybersecurity Review (FCSR, including exceptional approval flow, release closure)

- Reporting and Dashboard

- JIRA Integration

- User Authentication, User Authorization (Roles & Permissions, RBAC)

- Technical requirements

## USER NAVIGATION

### 2.1. Authentication & Authorization

1.  If the user without access to the LEAP platform attempts to open PICASso application, they will be redirected to the page where they can request a license.

<img src="media/image1.png" style="width:6.69291in;height:2.12543in" alt="A screenshot of a computer Description automatically generated" />

> When the license is assigned to the user they will be redirected to a screen as below:

<img src="media/image2.png" style="width:6.69291in;height:3.81688in" alt="A screenshot of a computer error Description automatically generated" />

> Clicking on the link above (in blue), user will be directed to ServiceNow page with the PICASso Request form already opened:

<img src="media/image3.png" style="width:6.69291in;height:5.71886in" alt="A screenshot of a computer Description automatically generated" />

> Using the process below, the user will raise a ticket in ServiceNow to request access to the tool.

1.  When the page is accessed, information in the fields "Requested by", "Email ID" are auto populated. Please verify.

2.  If you are raising the request on behalf of another user, please identify the name from the drop down in the field “Requested for” and verify the information from field “Email ID”

3.  Select option "Access request" for the field “What is your request related to?”, when you are raising a request to access PICASso.

4.  Select the Select BU / Org 1 the user is from using the drop-down options in this field.

5.  Depending on the availability provide ‘LOB / Org 2 and Entity / Org 3.’

6.  Enter the Product / Project information for which you are raising the access request.

7.  Depending on the availability, provide STAC information.

8.  Select the requested role of the user from the drop down.

9.  Provide a brief business justification.

10. Provide any supporting documents using the ‘add attachments’ option.

11. Click Submit to create the request successfully.

> When all the required information is entered, the page may look like the below image:
>
> <img src="media/image4.png" style="width:6.69291in;height:7.14743in" alt="A screenshot of a computer Description automatically generated" />
>
> Post submission a ticket is created with ID ‘REQxxxx’ and the page may look like on the image below:
>
> <img src="media/image5.png" style="width:6.69291in;height:2.59134in" alt="A screenshot of a computer Description automatically generated" />
>
> Points to note:

1.  Depending on the role requested, the user may be asked to study the training documents that are required to be completed as a part of access permission requirements.

2.  Depending on the situation, a user may be required to hold more than one role. in such scenarios raise separate tickets for each role.

<!-- -->

2.  If the user has access to and assigned role in PICASso they will be prompted to enter Ping SSO details when they attempt to open PICASso application.

<img src="media/image6.png" style="width:3.93701in;height:1.90091in" alt="A screenshot of a login page Description automatically generated" />

### Landing Page Overview

When the user logs in to PICASso, the system brings them to the Homepage, where they can see four tabs on the main screen form “My Tasks”, “My Products”, “My Releases”, “Reports & Dashboards”.

<img src="media/image7.png" style="width:7.9in;height:3.825in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### My Tasks

“My Tasks” tab shows all the open tasks assigned to the user or available to the user with a SuperUser role. The user can filter the list of tasks by the following data:

| Search | Drop down field, listing names of the tasks |
|:---|----|
| Release: | Drop down field, listing names of the releases opened for the user in the system |
| Product: | Dropdown field listing all products associated with the presented task |
| Task Creation Date Range: | Range of dates |
| Show Closed Tasks | Toggle button |
| Assignee | Look up field. By default, current user is selected. But if the user has access to other users’ tasks they can select them from the list. |

The “Reset” button clears up all filters’ settings.

To open the task the user either click on the “Name” of the task or “Review” button in the row.

<img src="media/image8.png" style="width:7.9in;height:3.55972in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### My Products

<img src="media/image9.png" style="width:7.9in;height:3.58264in" alt="A screenshot of a computer AI-generated content may be incorrect." />

“My Products” tab shows all the products registered in the system and visible/opened for the user. The user can filter the list of products by:

| Search | Drop down field, listing names of the products |
|:---|----|
| Org Level 1 | Dropdown field with the list of Org Level 1 (BU Level) organizations |
| Org Level 2 | Dropdown field with the list of Org Level 2 (Department/LOB level) organizations |
| Product Owner | Dropdown field with the list of Product Owners names. |
| Show Active Only | Toggle button, enabled by default |
| DOC Lead | Dropdown field with the possibility to search user by name or select from the list. This filter is displayed only if the user has permissions to see and interact with Digital Offer Certification process. If there are no products with DOC process on the page, this filter won’t be shown. |

If user has permissions to see and interact with DOC process and there is at least one product with DOC on the page, then additional columns ‘Vesta ID’, ‘DOC Lead’ and ‘Security Advisor’ will be shown and ‘DOC Lead’ filter will be displayed.

The “Reset” button clears up all filters’ settings.

To open the product the user clicks on the name of the product in the “Product” column and to open the latest release for this product - on the release version under the “Latest Release” column.

<img src="media/image10.png" style="width:7.9in;height:3.87292in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### My Releases

<img src="media/image11.png" style="width:7.9in;height:3.83542in" alt="A screenshot of a computer AI-generated content may be incorrect." />

“My Releases” tab shows by default all releases in progress linked to the products the user has access to. The user can filter the list of releases by:

| Search | Drop down field, listing a concatenation of Product Name and Release |
|:---|----|
| Product | Dropdown field listing all products associated with the presented releases |
| Target Release Date | Range of dates |
| Status | Drop down field listing release statuses |
| Show Active Only | Toggle button, enabled by default. When enabled, only ongoing releases are displayed. Once disabled, Cancelled, Completed and Inactive releases are shown |

The “Reset” button clears up all filters’ settings.

To open the release the user clicks on the release version under the “Release” column and to open the linked JIRA project – on the “Link to the Source project” under the “JIRA” column.

<img src="media/image12.png" style="width:7.9in;height:3.87917in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### Reports & Dashboards

“Reports & Dashboards” tab presents the metrics for each product the user has access to based on his role and level of visibility (Org Level 1 or BU Level, Org Level 2 or Department/LOB level, Org Level 3 or LOB/Entity level, Product).

##### **2.2.4.1. New and Updated Columns**

The following enhancements have been made to the columns and data displayed on the **My Reports** page:

Columns/Data

The following information is now available and visible as columns:

1.  **Product** - displays the product name and links to the product's details pages.

2.  **Release**

    1.  Shows the most recent release created for the product in PICASso (based on the release creation date).

    2.  The release number is clickable, allowing users to open the related release details.

3.  **Release Status**

    1.  Displays the status of the release.

4.  **Responsible Users**

Separate columns for the following roles, reflecting the users responsible for the product or release:

1.  Product Owner

2.  Security Manager

3.  Security Advisor

4.  Privacy Advisor

5.  PQL

6.  SVP LoB

7.  LOB Security Leader

<!-- -->

5.  **Data Privacy Risk Level - d**isplays the calculated Privacy Risk level for the release.

6.  **Cybersecurity Risk Level** - displays the calculated Cybersecurity Risk level for the release.

7.  **Last BU Level FCSR Date** - shows the date of the FCSR review completed for the product (conducted by the BU officer).

> **Notes**:

1.  Displays "Unknown" if the date is not available.

2.  The value is highlighted if the date is "Unknown" or older than 12 months from today's date.

<!-- -->

8.  **Last Full Pen Test Date**

    1.  Displays the date of the most recent Pen Test conducted for the product.

**Notes**:

1.  Displays "Unknown" if unavailable.

2.  The value is highlighted if the date is "Unknown" or older than 12 months.

<!-- -->

9.  **Last Completed Release**

    1.  Displays the data from the most recent release with a status of "Completed" for the product.

    2.  The release number is clickable.

10. **Last Completed Release FCSR Decision - d**isplays the FCSR Decision from the last completed release.

11. **Last Completed Release FCSR Exception Required**

    1.  Displays "Yes" or "No" based on whether an FCSR Exception was required for the most recent release.

**Note:** The value is highlighted if it is "Yes."

12. **Number of Open Actions/Conditions**

    1.  Shows the count of all open actions (SDL/FCSR and Privacy) that are not in "Closed" status.

**Note**: The number is clickable, linking users to the **Actions Summary** of the last release.

<img src="media/image13.png" style="width:7.90625in;height:3.88542in" />

##### **2.2.4.2. Updated and New Filters**

The following filters have been introduced/improved to enable granular control over the reports:

- **General Filters**

1.  Org Level 1 – filter by Business Unit

2.  Org Level 2 – filter by Line of Business

3.  Org Level 3 – filter by Entity

4.  Product – filter by product

5.  Release Number

    1.  Displays all releases for the selected products.

**Note**: These filters are interdependent. For example:

1)  *If Org Level 1 is set to "Industrial Automation", only related child organizations will appear in Org Level 2.*

2)  *If a product is selected, only releases linked to the product will appear in the Release Number filter.*

- **User Role Filters**

Separate filters are available for the following roles associated with a product or release:

- Product Owner

- Security Manager

- Security Advisor

- Privacy Advisor

- PQL

- SVP LoB

- LOB Security Leader

**Notes**:

- Multiple values can be selected at once (e.g., filtering by multiple Product Owners).

- All products/releases linked to the selected roles will be displayed.

**Additional Filters**

1.  Product Creation Period - filter based on the date or date range when the product was created.

2.  Release Creation Period - filter based on the date or date range when the release was created.

3.  Product Type

    1.  Filter products by their type.

    2.  Multiple values can be selected for this filter.

<img src="media/image14.png" style="width:7.90625in;height:2.27083in" />

##### **2.4.2.3. Filter Data by a Specific Release (Non-Current)**

When filtering by a specific release that is not the current one, the following information will be displayed in the report columns:

- Product Name

- Release Number

- Release Status

- Responsible User Roles (Product Owner, Security Manager, Security Advisor, Privacy Advisor, Privacy Reviewer, PQL, SVP LOB, LOB Security Leader)

- Data Privacy Risk Level

- Cybersecurity Risk Level

- **FCSR Decision** and **FCSR Exception Required Flag** from the specified release

**Note**: Columns like **Last BU Level FCSR Date**, **Last Full Pen Test Date**, **Last Completed Release**, and **Number of Open Actions/Conditions** will not display any data for non-current releases.

##### **4. Configuring Column Display**

Users can personalize the columns displayed on the **My Reports** page:

1.  **Configure Columns**:

    1.  Click on the "Configure Columns" button.

    2.  Use the drop-down list to select or deselect columns.

    3.  Click "Done" to save changes.

**Notes**:

- Changes apply only to the individual user's view and do not affect other users.

- Users can save their selection, so the configuration is loaded by default when they revisit the page.

2.  **Additional Options**:

    1.  **Cancel**: Discard changes by clicking the Cancel button.

    2.  **Restore Default**: Revert to the default column settings.

> Default columns: Product Name, Release, Release Status, Data Privacy Risk Level, Cybersecurity Risk Level, Last BU Level FCSR Date, Last Full Pen Test Date, Last Completed Release, FCSR Decision, and Number of Actions.
>
> <img src="media/image15.png" style="width:3.20028in;height:3.57531in" />

Clicking on the “Access Tableau” will redirect the user to the reports in Tableau, to which the same access rules are applied as in PICASso UI.

Access to Tableau should be requested via ticket in ServiceNow, that can be submitted here - [Service Catalog - support@Schneider](https://schneider.service-now.com/supportatschneider?id=sc_cat_item&sys_id=0f0a231a93118650a067bd158aba10d1)

### New Product Creation

The new release can be created only for the product existing in PICASso. So, the first step- is to create a new product in PICASso. Only authorized users can create a new product in the tool (Product Admin Org 1, Product Admin Org 2, Product Admin Org 3). To create a new product please follow the next steps:

1.  On Home page click on the “New Product” button in the upper right corner of the screen.

<img src="media/image16.png" style="width:6.69375in;height:2.35625in" alt="A screenshot of a computer Description automatically generated" />

2.  The Product creation screen form will be displayed.

Note: Only “Product Details” tab will be available for data entering. “Releases” is greyed out because releases can be added only to already created product.

<img src="media/image17.png" style="width:7.9in;height:3.85347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

3.  Enter the data as follows:

<table>
<colgroup>
<col style="width: 40%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr>
<th style="text-align: left;">Product Name</th>
<th>Free text field</th>
</tr>
</thead>
<tbody>
<tr>
<th style="text-align: left;">Product State</th>
<td>Dropdown field with possible options of the product’s state in the product lifecycle (Under Development, Continuous Development, etc.). The field is mandatory.</td>
</tr>
<tr>
<th style="text-align: left;">Product Definition</th>
<td>Classification of the product as per IEC62443 standard: Component as Whole or System. Select ‘None’ if IEC62443 is not applicable for your product. Dropdown filed, mandatory. This field can be updated after product creation, but it should be done if the release is on ‘Creation&amp;Scoping’ stage as updating will impact product requirements scoping. If product definition has been changed, questionnaire must be re-submitted. If the release is on the stage where the questionnaire can’t be re-submitted, then the changes will be applied to future releases.</td>
</tr>
<tr>
<th style="text-align: left;">Product Type</th>
<td><p>Type of product, e.g. Hosted Device, Mobile Application, etc.</p>
<p>Dropdown field, is mandatory,</p>
<p>This field can be updated after product creation, but it should be done if the release is on ‘Creation&amp;Scoping’ stage as updating will impact product requirements scoping. If product type has been changed, questionnaire must be re-submitted. If the release is on the stage where the questionnaire can’t be re-submitted, then the changes will be applied to future releases.</p></td>
</tr>
<tr>
<th style="text-align: left;">Digital Offer</th>
<td>The toggle button should be enabled if Digital Offer Certification should be done for the product. Enabling the toggle opens DOC Details section with Vesta ID (numeric field), IT Owner and Project Manager (user lookups) fields will be shown.</td>
</tr>
<tr>
<th style="text-align: left;">Data Protection&amp;Privacy</th>
<td><p>Toggle button. Enables Data Protection and Privacy Review for the product.<br />
How to disable it: If the product has an active release, it is not possible to disable the DPP toggle.</p>
<p>On the Creation &amp; Scoping stage DPP can be disabled only before completing the Questionnaire. On the Review &amp; Confirm stage, it is possible to return to the previous stage and retake the Questionnaire. If Data Privacy Requirements are not scoped for the release, the Data Protection &amp; Privacy Review is automatically considered not applicable. Setting Privacy Risk = No Risk also makes DPP not applicable.<br />
On the Manage and next stage the release can only be cancelled or inactivated, after which DPP can be disabled on the product details page.</p></td>
</tr>
<tr>
<th style="text-align: left;">Brand Label</th>
<td>Toggle Button</td>
</tr>
<tr>
<th style="text-align: left;">Vendor</th>
<td>Free text field, mandatory if the Brand Label is turned on</td>
</tr>
<tr>
<th style="text-align: left;">Commercial Reference Number</th>
<td>Free text field</td>
</tr>
<tr>
<th style="text-align: left;">Product Description</th>
<td>Provide a description of the product. It is possible to format the text, add links, tables, pictures.</td>
</tr>
<tr>
<th style="text-align: center;">Product Organization</th>
<td></td>
</tr>
<tr>
<th style="text-align: left;">Org Level 1</th>
<td style="text-align: left;">Dropdown field with the list of BU level organizations available to the user (it depends on the scope). The field is mandatory.</td>
</tr>
<tr>
<th style="text-align: left;">Org Level 2</th>
<td>Dropdown field with list of Department/LOB level values depending on the selection of Org Level 1. The field is mandatory.</td>
</tr>
<tr>
<th style="text-align: left;">Org Level 3</th>
<td>Dropdown field with list of LOB/Entity level values depending on the selection of Org Level 2.</td>
</tr>
<tr>
<th style="text-align: left;">Cross Organizational Development</th>
<td>Toggle button. Enable it if the product is owned by one team and developed by another one. Once enabled, additional fields ‘Development Org Level 1’, ‘Development Org Level 2’, ‘Development Org Level 3’ appear.</td>
</tr>
<tr>
<th style="text-align: left;">Development Org Level 1</th>
<td>Dropdown field. Specify a business unit of the development team.</td>
</tr>
<tr>
<th style="text-align: left;">Development Org Level 2</th>
<td>Dropdown field. Specify s line of business of the development team.</td>
</tr>
<tr>
<th style="text-align: left;">Development Org Level 3</th>
<td>Dropdown field. Specify an entity the development team belongs to.</td>
</tr>
<tr>
<th style="text-align: center;">Product Team (all fields are mandatory)</th>
<td></td>
</tr>
<tr>
<th style="text-align: left;">Product Owner</th>
<td>Look-up field. Specify the owner of your product here.</td>
</tr>
<tr>
<th style="text-align: left;">Security Manager</th>
<td>Look up field. Specify the security manager of your product.</td>
</tr>
<tr>
<th style="text-align: left;">Security and Data Protection Advisor</th>
<td>Look up field. Specify the security advisor of your product</td>
</tr>
<tr>
<th style="text-align: left;">Process Quality Leader</th>
<td>Look-up field. Specify PQL for the product.</td>
</tr>
<tr>
<th style="text-align: left;">Dedicated Privacy Advisor</th>
<td>This field is shown only if Data Protection and Privacy is applicable for the product (Data Protection and Privacy toggle button is enabled).</td>
</tr>
<tr>
<th style="text-align: center;">Security Summary</th>
<td></td>
</tr>
<tr>
<th style="text-align: left;">Minimum Oversight Level</th>
<td>Dropdown field. LOV: Team, LOB Security Leader, BU Security Officer. Minimum Oversight Level influences Scope Approver and FCSR Reviewer. Please refer to the table - <a href="https://schneiderelectric.sharepoint.com/:x:/s/GRCProjectGroup/ER6XF2wPGJ5AsyLfx8TlHXYBrlQZvDF2Wd2f3h7J-yGucQ?e=pRIldC">Routing and Decision-Making Logic for Scope Approval and FCSR Review Based on Oversight Level and Risk Classification.xlsx</a></td>
</tr>
<tr>
<th style="text-align: left;">Last BU Security FCSR Date</th>
<td rowspan="3" style="text-align: center;">These fields are displayed in view mode when at least one release is created for the product.</td>
</tr>
<tr>
<th style="text-align: left;">Last Full Pen Test Date</th>
</tr>
<tr>
<th style="text-align: left;">Continuous Penetration Testing</th>
</tr>
<tr>
<th style="text-align: center;">Product Configuration</th>
<td></td>
</tr>
<tr>
<th style="text-align: left;">Show the Process sub-requirements within Release Management process</th>
<td>Toggle button, non-mandatory. If enabled, sub-requirements on ‘Process Requirements’ tab in the release will be shown. Product sub-requirements are always shown in the release.</td>
</tr>
<tr>
<th style="text-align: left;">Tracking Tools Configuration</th>
<td><p>Shows the list of the tools used for the requirements and issues management of the product as a toggle button.</p>
<p>To specify the tool used, the user can activate the toggle and add details in the opened fields.</p>
<p>Note: the tools displayed in the list are integrated with PICASso and can be used to submit requirements or actions to these tools, manage them in these tools and update PICASso status based on the changes completed for the tickets/ requirement objects.</p>
<p>Jira tool can be selected for both Process/Product Requirements.</p>
<p>Jama integration is available for product requirements only.</p></td>
</tr>
<tr>
<th style="text-align: left;">Jama Project Id (shown and mandatory when “Jama” tracking tool is activated for the product)</th>
<td><p>Allows to specify the project id from Jama which is used to manage product requirements of this product.</p>
<p>Jama Project ID can be found in the link to the requirements in Jama or as the API ID on the Project details.</p></td>
</tr>
<tr>
<th style="text-align: left;">Jira Source Link (shown and mandatory when “Jira” tracking tool is activated for the product)</th>
<td>Provide a link to the project in Jira (mandatory if Jira is selected as Requirements&amp;Issues Tracking tool)</td>
</tr>
<tr>
<th style="text-align: left;">Jira Project Key (shown and mandatory when “Jira” tracking tool is activated for the product)</th>
<td>Key to the project in Jira. Typically, it is the first letters of the tickets (for instance, PIC for PICASso Jira project) or it also can be found in project settings</td>
</tr>
<tr>
<th style="text-align: left;">Product requirements tracking tool</th>
<td><p>Allows selecting the tool used for the Product Requirements management from all the tracking tools activated for the product with the following options:</p>
<ul>
<li><p>Not Applicable – if this option is selected user won’t be able to submit Product Requirements to any tool in the releases</p></li>
<li><p>Jama (would be default when “Jama” is activated as the tracking tool) - allows submitting product requirements to Jama and create requirement objects for them.</p></li>
<li><p>Jira - allows submitting product requirements to Jira and create requirement objects for them.</p></li>
</ul></td>
</tr>
<tr>
<th style="text-align: left;">Process requirements and issues tracking tool</th>
<td><p>Allows selecting the tool used for the Process Requirements and actions management from all the tracking tools activated for the product with the following options:</p>
<ul>
<li><p>Not Applicable – if this option is selected, user won’t be able to submit Process Requirements and actions to any tool in the releases</p></li>
<li><p>Jira - allows submitting Process Requirements and actions to Jira and create requirement objects for them.</p></li>
</ul></td>
</tr>
</tbody>
</table>

4.  Once Jama or Jira connection details are entered, please test the connection by pressing the button “Test Connection”. If the data is entered incorrectly (or if the connection to Jama or Jira server is unavailable at this moment), you’ll get an error message.

<img src="media/image18.png" style="width:7.90625in;height:3.54167in" />

If the data entered correctly, you’ll get a message with the confirmation of successful connection check.

<img src="media/image19.png" style="width:7.90625in;height:3.75in" />

***Note:** Every product in PICASso will get process and product requirements to be met, to track the progress of implementation the statuses are used. If the product team will use Jama or Jira to manage these requirements and get synchronized their statuses with PICASso to avoid manual work, they need to configure the mapping between statuses in PICASso and Jama/Jira. To do so, follow the steps described in [the Status Mapping Configuration section](#status-mapping-configuration).*

5.  Once all you entered product details information and (if needed) Jama or Jira integration details are entered, click on the “Save” button to finish the product creation. If you want to cancel creation of the product, click on “Cancel” button and the product will be dropped. “Reset” button will clear up all fields on the form and would allow to create product from scratch.

6.  When a product is created, a “Releases” tab will be enabled.

<img src="media/image20.png" style="width:7.9in;height:3.35833in" alt="A screenshot of a computer AI-generated content may be incorrect." />

### Product View

To view the product created, the user must go to the “My Products” tab and search for the needed product.

<img src="media/image21.png" style="width:6.69375in;height:2.40069in" alt="A screenshot of a computer Description automatically generated" />

Upon clicking on the “Product name” the system will open the “Product Details” form in the preview mode.

<img src="media/image22.png" style="width:7.90625in;height:3.84375in" />

Upon clicking on the “Releases” tab the list of the releases for this product can be viewed:

<img src="media/image23.png" style="width:6.69375in;height:2.79653in" alt="A screenshot of a computer Description automatically generated" />

### Product <u>Update</u>

The user can update the product details at any time. To do so, the user must go to the “My Products” tab and search for the product that should be updated. Upon clicking on the “Product name” the system will redirect the user to the “Product Details” form.

<img src="media/image24.png" style="width:7.90625in;height:3.83333in" />

#### Product details update

To change the product details, on the opened product details preview form the user should press “Edit Product” button at the bottom of the form. The form will become available for editing.

<img src="media/image25.png" style="width:7.90625in;height:3.875in" />

***Please note!!!** “Product Type” and ‘Product Definition’ fields are editable, but changing it can impact product requirements scoping. To re-scope the requirements, re-submit the questionnaire (it can be done on Creation&Scoping stage only).*

When all changes are entered, please click on “Save” button and changes will be saved. “Cancel” button will cancel all changes and bring the user back to the product view mode, while “Reset Form” button will revert all the added changes leaving the product details page opened in the edit mode.

<img src="media/image26.png" style="width:7.90625in;height:0.30208in" />

#### Status Mapping Configuration

If the product team will use Jama or Jira to manage process and product requirements or actions and get synchronized their statuses with PICASso to avoid manual work, they need to configure the mapping between statuses in PICASso and Jira.

To add/update the Status Mapping Configuration for the product, on the opened product details the user should:

1.  Press the “Edit Product” button at the bottom of the form. The form will become available for edits.

2.  Go to ‘Product Configuration’ and click on the “Status Mapping Configuration” link for the respective tool – the link displayed near the activated tool will open the corresponding Status Mapping Configuration to configure PICASso status to Jira status or PICASso status to Jama status accordingly.

<img src="media/image27.png" style="width:7.90625in;height:3.08333in" />

3.  On the opened Status Mapping Configuration form select “PICASso Status” from the drop-down list and specify the name of the corresponding “JamaStatus” or “Jira Status” from the Jama/Jira project linked to this product.

And confirm adding mapping with this combination.

<img src="media/image28.png" style="width:7.06322in;height:3.22917in" />

4.  The message of successfully added mapping is returned and mapping line is added to the table:

<img src="media/image29.png" style="width:7.90625in;height:5.125in" />

5.  Repeat these steps for all the possible statuses combinations on all the tabs in this form

> ***Note:** incorrect combination can be removed by clicking on the bin icon under the “Remove” column.*

6.  Click the “Confirm” button to save this configuration or click on the “Cancel” button if the added configuration should not be saved for this product.

> ***Note:** 1. The Status Mapping Configuration would be updated for this product only when the “Save” button on the Product Details page is clicked and all the changes added for the product would be saved.*
>
> *2. The tickets requirements created from PICASso would be created as the following objects:*
>
> *- Jama: both product requirements and product sub-requirements as the Customer level requirements.*
>
> *- Jira: requirements and actions as feature, sub-requirements as user stories.*
>
> *3. If any default mapping value is configured for the tool in PICASso, they would be shown on this pop-up, but you can also update this values for those used in your projects by removing not used values and specifying applicable values instead.*

#### 2.5.3. Product Change History

The Product Change History feature in PICASso allows users with appropriate permissions to view and track all activities and changes made to product details. This feature is accessible via the Product Details page and provides a comprehensive log of modifications, ensuring transparency and traceability for product management.

To access the history, navigate to ‘Product Details’ page and find ‘View History’ link:

<img src="media/image30.png" style="width:7.9in;height:3.85139in" />

Click this link to open Product Change History pop-up:

<img src="media/image31.png" style="width:7.9in;height:3.82708in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Upon clicking the "View History" link, a pop-up window appears displaying a table of all changes made to the product. The table includes the following columns:

| Column Name | Description |
|----|----|
| Date | Displays the exact date and time of each change in the format: **dd mm yyyy hh mm**. Records are sorted in descending order by default (newest first). |
| User | Shows the name and profile image of the user who performed the activity. |
| Activity | Describes the type of change made (e.g., Product creation, Product details editing). |
| Description | Provides detailed information about the action taken. |

<img src="media/image32.png" style="width:7.9in;height:3.85764in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- If the number of records exceeds the default display limit, pagination controls appear below the table.

- A dropdown menu allows users to select how many records to display per page: **10, 20, 50, or 100** (default is 10).

<img src="media/image33.png" style="width:7.9in;height:3.84236in" alt="A screenshot of a computer AI-generated content may be incorrect." />

The Product Change History pop-up provides several filtering options to help users find specific records:

- **Search Input**: Filter records by entering keywords related to the User or Description fields.

- **Activity Dropdown**: Select from a list of all possible activities to filter the table by activity type.

- **Date Range Selector**: Choose a specific date range to view only the logs within that period.

<img src="media/image34.png" style="width:7.9in;height:3.84306in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- If no records match the applied filters, the message **"There is no data matching selected filter"** is displayed below the filters.

<img src="media/image35.png" style="width:7.9in;height:3.94236in" alt="A screenshot of a computer AI-generated content may be incorrect." />

The following user actions are tracked and displayed in the Product Change History table:

| Trigger | Activity | Description (as displayed in the system) |
|----|----|----|
| Product is created | Product creation | A product **\<Product_Name\>** has been created |
| Product Name is updated | Product details editing | Product Name is changed from **\<old value\>** to **\<new value\>** |
| Product State is updated | Product details editing | Product State is changed from **\<old value\>** to **\<new value\>** |
| Product Definition is updated | Product details editing | Product Definition is changed from **\<old value\>** to **\<new value\>** |
| Product Type is updated | Product details editing | Product Type is changed from **\<old value\>** to **\<new value\>** |
| Commercial Reference Number is updated | Product details editing | Commercial Reference Number is changed from **\<old value\>** to **\<new value\>** |
| Data Protection & Privacy toggle is activated/deactivated | Data Protection & Privacy details editing | Data Protection & Privacy toggle is activated/deactivated |
| Brand Label toggle value is activated/deactivated | Product details editing | Brand Label toggle is activated/deactivated |
| Vendor is updated | Product details editing | Vendor is changed from **\<old value\>** to **\<new value\>** |
| Product Description is updated | Product details editing | Product Description is updated |
| Digital Offer toggle is activated/deactivated | Digital Offer details editing | Digital Offer toggle is activated/deactivated |
| VESTA ID is added/removed | Digital Offer details editing | VESTA ID **\<VESTA ID\>** is added/removed |
| VESTA ID is updated | Digital Offer details editing | VESTA ID is changed from **\<old value\>** to **\<new value\>** |
| IT Owner is updated | Digital Offer details editing | IT Owner for VESTA ID **\<VESTA ID\>** is changed from **\<old value\>** to **\<new value\>** |
| Project Manager is updated | Digital Offer details editing | Project Manager for VESTA ID **\<VESTA ID\>** is changed from **\<old value\>** to **\<new value\>** |
| Org level 1/2/3 fields are updated | Product Organization editing | **\<Org Level 1/2/3\>** is changed from **\<old value\>** to **\<new value\>** |
| Development Org level 1/2/3 fields are updated | Product Organization editing | **\<Development Org Level 1/2/3\>** is changed from **\<old value\>** to **\<new value\>** |
| Product Owner is updated | Product Team editing | Product Owner is changed from **\<old value\>** to **\<new value\>** |
| Security Manager is updated | Product Team editing | Security Manager is changed from **\<old value\>** to **\<new value\>** |
| Security and Data Protection Advisor is updated | Product Team editing | Security and Data Protection Advisor is changed from **\<old value\>** to **\<new value\>** |
| Process Quality Leader is updated | Product Team editing | Process Quality Leader is changed from **\<old value\>** to **\<new value\>** |
| Dedicated Privacy Advisor is updated | Product Team editing | Dedicated Privacy Advisor is changed from **\<old value\>** to **\<new value\>** |
| Minimum Oversight Level is updated | Security Details editing | Minimum Oversight Level is changed from **\<old value\>** to **\<new value\>** |
| Jama tool is activated/deactivated | Tracking Tools editing | Jama tool is activated/deactivated |
| Jama Project Id is updated | Tracking Tools editing | Jama Project Id is changed from **\<old value\>** to **\<new value\>** |
| Jama Status Mapping Configuration was updated | Tracking Tools editing | Values for Jama |
| Status Mapping Configuration were updated |  |  |
| Jira tool is activated/deactivated | Tracking Tools editing | Jira tool is activated/deactivated |
| Jira source link is updated | Tracking Tools editing | Jira Source link value is changed from **\<old value\>** to **\<new value\>** |
| Jira Project Key is updated | Tracking Tools editing | Jira Project Key value is changed from **\<old value\>** to **\<new value\>** |
| Jira Status Mapping Configuration was updated | Tracking Tools editing | Values for Jira Status Mapping Configuration were updated |
| Product requirements tracking tool is updated | Tracking Tools editing | Product requirements tracking tool is changed from **\<old value\>** to **\<new value\>** |
| Process requirements and issues tracking tool is updated | Tracking Tools editing | Process requirements and issues tracking tool is changed from **\<old value\>** to **\<new value\>** |
| Show the Process sub-requirements within Release Management process toggle value is activated/deactivated | Product Configuration editing | Show the Process sub-requirements within Release Management process toggle is activated/deactivated |
| Data on the Data Protection and Privacy Summary is updated | Data Protection & Privacy details editing | Data on the Data Protection and Privacy Summary is updated |

### Release Management

Each release of the product goes through the stages and the assignee from the security team (Security Advisor, LOB Security Leader, BU Security Officer) to perform a task on Review and Confirm and FCSR Review stages is defined based on a few criteria:

- Minimum Oversight Level value (Team = Security Advisor level; LOB = Security Lead Level, BU=Security Officer Level)

- Risk Classification value (Initial & Major = Security Officer Level; Minor=Security Lead Level; Insignificant=Security Advisor Level)

- Last BU Level FCSR date (more than 12 months triggers Security Officer Level oversight)

> Please refer to the table for more details - [Routing and Decision-Making Logic for Scope Approval and FCSR Review Based on Oversight Level and Risk Classification.xlsx](https://schneiderelectric.sharepoint.com/:x:/s/GRCProjectGroup/ER6XF2wPGJ5AsyLfx8TlHXYBrlQZvDF2Wd2f3h7J-yGucQ?e=LimXhz)

#### Release Workflow

High level Release Workflow is depicted on the picture below:

<img src="media/image36.png" style="width:6.69375in;height:3.42431in" alt="A chart with green arrows Description automatically generated with medium confidence" />

#### Create & Scope

##### New Release

To create a new release of the product you should open the “Product” from the “My Products” tab. Next to the “Product details” tab there is a ‘Release’ tab where you click on the ‘Create Release’ button.

<img src="media/image37.png" style="width:7.90625in;height:3.25in" />

Once clicked, the pop-up appears where you can either create completely new release (if there are no releases for this product at all) or existing product release (in case there are releases for this product outside of PICASso)

<img src="media/image38.png" style="width:7.90625in;height:3.8125in" />

###### Release Details

Fill the details in the dialog box:

1.  Select if it is a completely new release or existing product release.

2.  Release Version.

3.  Target release date.

4.  Change summary – provide a short description of the changes to be made in this release.

Note: It is not possible to create a release with the same name/version if the previous release was cancelled. However, if the previous release was inactivated, creating a new release with the same name/version is allowed.

The default option is a ‘New Product Release’, and ‘Existing Product Release’ option appears only once when there is not any release created in PICASso for this product. The detailed description of this scenario could be found in the section [Onboarding Release.](#onboarding-release) If you have created ‘New Product Release’, but there are some releases of this product outside of PICASso, you can cancel existing release and then select the correct option ‘Existing Product Release’ and create corresponding release.

<img src="media/image39.png" style="width:5.55576in;height:2.52629in" alt="A screenshot of a computer Description automatically generated" />

Select ‘Continuous Penetration Testing’ and provide Cont. Pen Test Contract Date if needed. ‘Create and Scope’ to create a release.

<img src="media/image40.png" style="width:7.90625in;height:3.73958in" />

Post the creation of the release, it will appear in the list. All the releases are available on this page in their respective states. By default, only ongoing releases are shown. But if you disable ‘Show Active Only’ toggle button, ‘Completed’, ‘Cancelled’ and ‘Inactive’ releases will be shown (if any).

<img src="media/image41.png" style="width:7.9in;height:3.88472in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Click on the Release number from the ‘Release’ column and you will be directed to the release level page and verify the information below.

<img src="media/image42.png" style="width:7.90625in;height:3.875in" />To view the progress of the project, click on ‘View Flow’ and the track workflow will appear as shown below.

<img src="media/image43.png" style="width:7.90625in;height:3.88542in" />

####### 2.6.2.1.1.1. Workflow Fields

- Number of Submissions Needed/Done: Displays the total number of submissions required to progress to the next workflow stage. Updates dynamically to show how many submissions have been completed so far.

- Usernames of Responsible Individuals: Displays the names of team members responsible for approvals.

- Date of Submission: Shows the date when the release was submitted to the next stage. This is displayed for all completed stages.

When a release isn't submitted to the next stage yet:

- The system provides real-time information about the approval progress:

1)  The Number of Submissions status is displayed dynamically:

*Example: At the "SA & PQL Sign Off" stage, if two submissions are required and one submission has already been received, it will show: 1 of 2 submissions.*

2)  A Checkmark will appear next to the name of any approver who has already submitted the release. The number of approvals will be updated accordingly:

*Example: If three approvals are required and two are complete, it will show: 2 of 3 submissions required.*

######## **Special Case for the Creation & Scoping Stage**

If the release is in the "Creation & Scoping" stage and the required Questionnaire has not yet been submitted:

1)  The system determines the individuals responsible for the "Review & Confirm," "FCSR Review," and "Final Acceptance" stages based on:

- Minimum Oversight Level,

- Last BU Security Officer FCSR Date, and

- Data Protection and Privacy Applicability.

Once the Questionnaire is submitted and the Risk Classification and Privacy Risk are defined, the system will reassess and update the responsible individuals if changes are needed.

*Example:*

*Before Questionnaire Submission:*  
*Minimum Oversight Level is set to "Team," and the Last BU Security Officer FCSR Date is 15/12/2024. For the "Review & Confirm," "FCSR Review," and "Final Acceptance" stages, the responsible individual is the Security Advisor.*

*After Questionnaire Submission:*  
*If the Risk Classification is updated to "Initial," the responsible individual changes to the BU Security Officer. The workflow is automatically updated accordingly.*

######## **Workflow Updates Upon Submission**

Once a responsible individual submits the release for the next stage, under completed stage completion date will be displayed:

<img src="media/image44.png" style="width:7.09474in;height:1.25017in" alt="A green line with black text AI-generated content may be incorrect." />

######## **Assignment Logic**

Assignment is handled dynamically by the system based on backend logic. Below is a detailed explanation of the assignment rules at each stage.

**Stage-Specific Assignments**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr>
<th>Stage</th>
<th>Responsible roles</th>
</tr>
</thead>
<tbody>
<tr>
<th>Creation and Scoping</th>
<td>Product Owner or Security Manager</td>
</tr>
<tr>
<th>Review&amp;Confirm</th>
<td>Security Advisor/LOB Security Leader/BU Security Officer + Privacy Advisor (if DP is applicable for the release)</td>
</tr>
<tr>
<th>Manage</th>
<td>Product Owner/Security Manager/Security Advisor</td>
</tr>
<tr>
<th>SA&amp;PQL Sign Off (if DP is not applicable)</th>
<td>Security Advisor and Process Quality Leader</td>
</tr>
<tr>
<th>Security and Privacy Readiness Sign Off (if Data Protection and Privacy Review is applicable for the release)</th>
<td>Security Advisor, Process Quality Leader, Privacy Reviewer</td>
</tr>
<tr>
<th>FCSR Review</th>
<td>Security Advisor/LOB Security Leader/BU Security Officer. If exception required: CISO and/or SVP LOB</td>
</tr>
<tr>
<th>Post FCSR Actions</th>
<td>Product Owner/Security Manager</td>
</tr>
<tr>
<th>Final Acceptance</th>
<td><p>Security Advisor/LOB Security Leader/BU Security Officer – if FCSR Decision is Go with Pre-Conditions</p>
<p>PO/SM - if FCSR Decision is Go or Go with Post-Conditions</p></td>
</tr>
</tbody>
</table>

*Stage Assignment Example*

*Scenario:*

*Minimum Oversight Level: Team*

*Last BU Security Officer FCSR Date: 15/12/2024*

*Based on this information:*

*Before Questionnaire Submission:*  
*At "Review & Confirm," "FCSR Review," and "Final Acceptance" stages, the Security Advisor is responsible.*

*After Questionnaire Submission:*  
*Upon the questionnaire submission, Risk Classification is updated to "Initial." The responsibility transitions to the BU Security Officer, and this update is reflected in the system.*

####### Associated Products on the Release Details

1.  **Section Title**

The section is titled **"Reference to Schneider Electric Products"** and includes two tabs:

- **Included SE Components**

- **Part Of SE Products**

<img src="media/image45.png" style="width:7.9in;height:3.88819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

######## **Included SE Components Tab**

This tab displays products that are **included in the current product's release**. Each listed product includes detailed information, actionable buttons, and scrolling to accommodate long lists.

<img src="media/image46.png" style="width:7.9in;height:2.01389in" alt="A screenshot of a computer AI-generated content may be incorrect." />

######### **Table Columns and Data**

- **Product Name**: Name of the associated product.

- **Release Number**: The release number for the associated product (if available).

  - **Note**: Only one release can be selected per product.

- **Latest Release Number**: A read-only field showing the most recent release for the product in PICASso.

  - **Warning Icon**: If the values in the "Release Number" and "Latest Release Number" fields differ, a warning icon is displayed with the tooltip:  
    *"Release Number and Latest Release Number differ; please analyze and plan to update if necessary."*

  - **Determination of Latest Release**: The latest release is the one with the most recent "Completed" status date.

- **FCSR Decision**: The FCSR (Formal Cyber Security Review) decision for the release.

  - "No Go" decisions are highlighted in red.

- **FCSR Date**: Date of the FCSR review (if available). Only past dates (up to TODAY) are allowed.

- **Product Type**: Type of the product (e.g., System, Embedded Device).

- **Product Definition**: Definition of the product (e.g., System, Component).

- **Security and Data Protection Advisor**: The associated Security Advisor for the product.

- **Status**: Indicates the product's record status in PICASso (Active).

  - For manually added products (see below), this field will remain empty.

> **Action Buttons**

<img src="media/image47.png" style="width:4.5754in;height:2.47521in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- **Edit Button**

Allows users to:

- Select a different release from PICASso if available.

- Enter release and its details manually if the desired release is not registered in PICASso.

- Update all fields for manually added products.

<img src="media/image48.png" style="width:7.9in;height:4.04028in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- **Remove Button**

<img src="media/image49.png" style="width:4.16725in;height:2.03153in" alt="A screenshot of a computer error AI-generated content may be incorrect." />

Allows users to remove a product from the list. Upon removal:

- The product is deleted from the **"Included SE Components"** tab.

- It is also removed from related sections, such as:

  - **SE Brick/Library/Platform** of the Cybersecurity Residual Risks → 3rd Party Suppliers & SE Bricks.

  - **System Design** of the Cybersecurity Residual Risks → System Design section.

- The current product is removed from the **"Part Of SE Products"** tab for the removed product.

<!-- -->

- **Add Product Button**

<img src="media/image50.png" style="width:7.9in;height:1.7375in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Allows users to:

- Add products already registered in PICASso.

- Manually add products not registered in PICASso (see detailed guide below).

<img src="media/image51.png" style="width:7.9in;height:3.85486in" alt="A screenshot of a computer AI-generated content may be incorrect." />

> **Empty State for Included SE Components**

If no products are associated with the current product, the tab will display the following:

- **Add SE Product Button**: Allows the user to add products.

- **Empty State Message**: Displays *"There are no SE products included in this product."*

<img src="media/image52.png" style="width:7.9in;height:2.45556in" alt="A screenshot of a computer AI-generated content may be incorrect." />

2.  **Adding Products to the Included SE Components Tab**

######### Add SE Product Button (Registered Products in PICASso)

3.  Click **Add SE Product**.

4.  A pop-up appears for product search or manual adding.

5.  **Search for a registered product** by:

    - Entering the product name in the **Product Name** field (shows active products in PICASso).

    - Selecting a specific release in the **Release Number** dropdown (shows all valid releases, or "Release not found").

<img src="media/image53.png" style="width:7.9in;height:3.83125in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- **Adding Releases Not Registered in PICASso**

If the release is not found, select **"Release not found"** and enter release details manually:

- **Release Number**: Required.

- **FCSR Decision**: Dropdown with valid FCSR values. (Optional)

- **FCSR Date**: Required if FCSR decision is provided. Only past dates are allowed.

<img src="media/image54.png" style="width:7.9in;height:3.825in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image55.png" style="width:7.9in;height:3.01319in" alt="A screenshot of a computer AI-generated content may be incorrect." />

After completing the form, click **Save**. Upon confirmation:

1.  The product appears in **Included SE Components**.

2.  Depending on its type:

    - **Brick/Library/Platform**: Added to **Cybersecurity Residual Risks → 3<sup>rd</sup> Party Suppliers& SE Bricks** section.

    - Other types: Added to **Cybersecurity Residual Risks → System Design** section.

3.  The current product is added to the **Part of SE Products** tab of the associated product.

######### **Manually Adding Products Not Registered in PICASso**

If the product is not registered in PICASso:

1.  Select **Create New Dependencies with SE Product**.

2.  Fill in the following fields:

    - **Product Name**: Name of the product.

    - **Product Type**: Dropdown (e.g., System, Embedded Device).

    - **Product Definition**: Dropdown (e.g., Component, System).

    - **Release Number**: Number of the release.

    - **FCSR Decision** (Optional): Dropdown with valid values.

    - **FCSR Date** (Optional): Must be a past date (≤ TODAY).

<img src="media/image56.png" style="width:7.9in;height:3.80486in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If a product is already included in the current release (on either tab), the system will:

1.  Return an error message: *"This product has already been added to the list."*

2.  Prevent the addition of duplicate products.

######## **Part Of SE Products Tab**

The **Part of SE Products** tab provides a **read-only** list of products in which the current product is included.

######### Table Columns and Data

- **Product Name**: Name of the associated product.

- **Release Number**: The release number of the associated product.

- **FCSR Decision**: The FCSR decision for the release ("No Go" highlighted in red).

- **FCSR Date**: Date of the FCSR review.

- **Product Type**: Type of the product (e.g., System, Embedded Device).

- **Product Definition**: Definition of the product (e.g., System, Component).

- **Security Advisor**: Security Advisor associated with the product.

- **Status**: Status in PICASso (Active).

<img src="media/image57.png" style="width:7.9in;height:2.29444in" alt="A white rectangular object with text AI-generated content may be incorrect." />

######### Limitations

- Users cannot **edit**, **remove**, or **add** products from this tab. It is strictly for reviewing linked products.

###### Roles & Responsibilities

Navigate to ‘Roles and Responsibilities’ section to view key SDL roles. This is for information only and will be defaulted to the individuals assigned in the [“Product Details”](#new-product-creation) screen and in the BackOffice.

<img src="media/image58.png" style="width:6.89731in;height:3.34722in" alt="A screenshot of a computer Description automatically generated" />

Under the section, ‘Product roles’ select individuals playing these roles in the release and make changes when required.

NOTE!!! These individuals will not have access to the PICASso and will not perform any action/task here.

<img src="media/image59.png" style="width:6.69375in;height:1.43611in" alt="A screenshot of a computer Description automatically generated" />

Identify the role/s an individual is required to be assigned from the table above and follow the below steps to assign the roles to a particular user.

1)  To assign a new individual for a role, click on “+ADD USER” if you are adding a new individual or click on pencil icon under “TEAM MEMBERS” column to add an individual to the role. Type of the name of the individual and select from the drop down.

2)  To replace an individual in a role, click on the "Pencil" icon next to the current individual's name. Select the new individual from the drop-down menu.

3)  To remove an individual from a role, navigate to the Roles and Responsibilities tab. Identify the individual you want to remove and click on the "Bin" icon. 

4)  Please verify the email address and location that should auto populate when an individual is selected. 

5)  Please note that SDL roles are added by default.

<u>Note.</u> Filling ‘Product Roles’ section is optional on this stage. It will become mandatory on the ’Manage’ stage.

###### Questionnaire

Navigate to ‘Questionnaire’ Tab and click on ‘Start Questionnaire’ button to define Process and Product Requirements.

<img src="media/image60.png" style="width:6.61111in;height:3.19555in" />

After clicking on the 'Start Questionnaire' button, the list of questions will appear. Answer all the questions, then click on 'Submit' at the bottom right corner of the screen. If any required questions are not answered, an error message will appear, prompting you to answer all required questions. Provided answers are automatically saved every 1 minute, but to scope the requirements and move on, you need to provide an answer to each question and submit the questionnaire.

<img src="media/image61.png" style="width:7.90625in;height:3.86458in" />

After submitting, Process and Product Requirements Tabs will become available.

When the questionnaire is completed, the system automatically calculates the Privacy Risk (if Data Protection and Privacy is applicable) and Risk Classification value based on the business rules.

<img src="media/image62.png" style="width:7.9in;height:3.83819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

###### Process Requirements

Navigate to the Process Requirement tab. Here you can see a list of generated requirements. They are sorted by SDL Practices and collapsed by default.

<img src="media/image63.png" style="width:7.9in;height:3.86597in" alt="A screenshot of a computer AI-generated content may be incorrect." />

When you expand an SDL Practice, you will see the list of requirements with its name, description, and status:

<img src="media/image64.png" style="width:7.9in;height:3.85347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

2.6.2.1.4.1 Showing or Hiding Sub-Requirements

The setting "Show the Process sub-requirements within Release Management process" on the ‘Product Details’ page affects how the Process Requirements page displays parent requirements and their sub-requirements.

<img src="media/image65.png" style="width:7.9in;height:3.88056in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Behaviour Based on Setting Configuration**

Unchecked Setting: The Process Requirements tab displays only the parent requirements, without sub-requirements.

<img src="media/image66.png" style="width:7.9in;height:3.82292in" alt="A screenshot of a computer AI-generated content may be incorrect." />

On the Product Requirements tab, both requirements and sub-requirements are visible regardless of this setting.

Checked Setting:

Both requirements and sub-requirements are visible on both the Process Requirements page and Product Requirements tab.

<img src="media/image67.png" style="width:7.9in;height:3.87361in" alt="A screenshot of a computer AI-generated content may be incorrect." />

######## **Trigger-Condition Logic**

The visibility of sub-requirements depends on product-specific triggers and scoping logic. Below are the rules for handling visibility:

- Sub-requirement Applicable but Parent Requirement Not Applicable:

Parent requirements are visible on the Process Requirements page, but sub-requirement visibility depends on the setting.

- Parent Requirement Applicable but Sub-requirement Not Applicable:

Parent requirements are visible, and sub-requirement visibility still depends on the setting.

- Both Parent and Sub-requirement Applicable:

Parent requirements are always shown, and sub-requirement visibility follows the setting.

- Neither Parent nor Sub-requirement Applicable:

Neither parent nor sub-requirements are displayed.

2.6.2.1.4.2 Expanding and Collapsing Sub-Requirements

When sub-requirements are visible, users can manage their display using the following controls:

**Default View**

Sub-requirements are collapsed by default on the Process Requirements and Product Requirements tabs.

<img src="media/image68.png" style="width:7.9in;height:3.12847in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Expand/Collapse Controls**

Users can expand/collapse sub-requirements for a specific parent requirement by clicking the arrow icon next to the parent requirement name:

<img src="media/image69.png" style="width:7.90625in;height:2.68752in" />

Clicking once expands the list of sub-requirements.

<img src="media/image70.png" style="width:7.90625in;height:2.32292in" />

Clicking again collapses the list.

**Show All Sub-Requirements**

The toggle “Show All Sub-Requirements” lets users expand/collapse all sub-requirements associated with visible parent requirements.

Toggle On: All sub-requirements are expanded.

<img src="media/image71.png" style="width:7.9in;height:3.82083in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Toggle Off: All sub-requirements are collapsed.

<u>Notes</u>

No Sub-requirements Available:

If no sub-requirements exist for a parent requirement, ‘Show sub-requirements' toggle and the arrow icon is not displayed.

<img src="media/image72.png" style="width:7.9in;height:3.85069in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Filtering Requirements by SDL Practice**

To filter the requirements by specific SDL Practice, navigate to filter panel and select practice from the dropdown list:

<img src="media/image73.png" style="width:7.9in;height:3.87361in" alt="A screenshot of a computer AI-generated content may be incorrect." />Once the filter is applied, you will see the list of requirements from selected SDL Practice:

<img src="media/image74.png" style="width:7.9in;height:3.91181in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Filtering Requirements by Status**

Users can refine their view of requirements and sub-requirements by applying status filters.

- Using the Status Filter

Filter Panel:

Click on the “Status” filter dropdown.

<img src="media/image75.png" style="width:7.9in;height:3.83889in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Select the desired status from the list:

<img src="media/image76.png" style="width:7.9in;height:3.83056in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Filtered View:

Only requirements (and their sub-requirements, if visible) with the selected status will be shown.

<img src="media/image77.png" style="width:7.9in;height:3.84931in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<u>Note.</u> If sub-requirement has selected status, but its parent has a different status, this parent requirement will be shown as well.

*Example. **IEC62443-4-2:2019 ISA/IEC62443-4-2:2019 Component Requirements** (parent) has status ‘Planned’, sub-requirement ‘IEC62443-4-2:2019-EDR-SL1-01 EDR 2.4 - Mobile code’ has status ‘Done’. When filtering by ‘Done’ status, parent requirement will be shown:*

<img src="media/image78.png" style="width:7.9in;height:3.83819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Empty State:

If no requirements meet the selected status, an empty message is displayed:

<img src="media/image79.png" style="width:7.9in;height:3.82083in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Each process requirement has Accountable role and Accountable person, it is shown in the list:

<img src="media/image80.png" style="width:7.9in;height:3.84514in" alt="A screenshot of a computer AI-generated content may be incorrect." />

You can also filter by these values:

<img src="media/image81.png" style="width:7.9in;height:3.9in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image82.png" style="width:7.9in;height:3.8375in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Reset Filters**

Click “Reset” to clear all selected statuses and refresh the page, showing all requirements and sub-requirements.

<img src="media/image83.png" style="width:7.9in;height:0.77083in" />

Hierarchical and Ordered View of Requirements

Requirements and sub-requirements are displayed hierarchically and sorted by their Requirement Order Code.

The hierarchy follows this format:

Level 1: Category/SDL Practice (e.g., "Authentication")

Level 2: Parent Requirements (e.g., CAL-0 California Connected Devices Law)

Level 3: Sub-requirements (e.g., CAL-2, CAL-3)

**Requirement Selection and Bulk Changes**

**Selecting Requirements**

Individual Selection:

Select any parent requirement or sub-requirement by ticking the checkbox next to the requirement name. If yo tick on parent requirement, additional sub-menu appears with two options: Select Parent Only and Select Parent and Sub-requirements:

<img src="media/image84.png" style="width:7.90625in;height:3.85417in" />Upon uncheking the checkbox, additional sub-menu appears as well (parent+subs are selected): De-select Parent only and De-select parent and its sub-requirements.

<img src="media/image85.png" style="width:7.90625in;height:3.88542in" />

<img src="media/image86.png" style="width:7.90625in;height:3.8125in" />

You can select/unselect the requirements in bulk if needed. To do that use checkbox in the header:

<img src="media/image87.png" style="width:7.90625in;height:3.89583in" />If you want to de-select the requirements in bulk, no additional sub-menu appears.

**Bulk Edit**

Once requirements are selected, the “Edit” button becomes enabled.

<img src="media/image88.png" style="width:7.90625in;height:3.83333in" />

Bulk Edit Form:

- Clicking the button opens a pop-up form with fields for:

<!-- -->

- Status Update: Change the status of selected requirements/sub-requirements.

- Evidence Link: Add a link to supporting evidence.

- Justification: Provide justification for the status change.

<!-- -->

- Saving Changes: Click “Save” to update selected requirements with the new status, evidence link, and justification.

- Canceling Changes: Click “Cancel” or the “X” icon to discard changes. Selections remain intact.

<img src="media/image89.png" style="width:7.90625in;height:3.875in" />

From the dropdown menu in the ‘Status’ field, you can select multiple statuses, such as Not Applicable or Postponed. Once selected, click on Save to close the dialog box.

<img src="media/image90.png" style="width:7.90625in;height:3.875in" />

The ‘Justification’ field will become mandatory if you choose ‘Not Applicable’ or ‘Postponed’ status.

<img src="media/image91.png" style="width:6.84226in;height:3.29195in" />

Evidence link must be provided for the requirements with ‘Done’ status.

<img src="media/image92.png" style="width:6.75892in;height:3.26695in" />

Hover over ‘more’ link to see the full description of the requirement:

<img src="media/image93.png" style="width:7.90625in;height:3.85417in" />

To edit the status of each specific requirement and insert connected links, click on three dots next to the status label:

<img src="media/image94.png" style="width:7.90625in;height:2.33333in" />

Enable ‘Show all requirements’ toggle button to view all requirements irrespective of their status. This way, the requirements which weren’t scoped for the release (have ‘Not Selected’ status) are also visible.

<img src="media/image95.png" style="width:7.90625in;height:3.77083in" />

You can add requirements that weren’t scoped (they have ‘Not Selected’ status). There are two ways to do so.

The first option is to add each requirement manually. Click on three dots, then ‘Add’, and provide a justification why you need to add this requirement.

<img src="media/image96.png" style="width:7.90625in;height:3.82292in" /><img src="media/image97.png" style="width:7.90625in;height:3.86458in" />

If you want to remove this requirement, click on three dots again, then ‘Remove’ button and provide mandatory rationale for the removal.

<img src="media/image98.png" style="width:7.90625in;height:3.6875in" /><img src="media/image99.png" style="width:7.90625in;height:3.80208in" />The second option to add not selected requirements in a bulk (in case you need to add many items). To do so, use the checkboxes to select the requirements and then click on ’Add’ button in Bulk Actions section:

<img src="media/image100.png" style="width:7.90625in;height:3.85417in" />

If there is a need to re-scope requirements, navigate to the ‘Questionnaire’ tab to review the responses to the questionnaire answered at 2.6.2.1.3. At the bottom of the screen, use the "Edit Answers" option to make changes to these responses.

<img src="media/image101.png" style="width:7.90625in;height:3.89583in" />

Submit the new answers and verify the Privacy Risk and Risk Classification. It can be re-calculated depending on the answers provided. Process and Product Requirements can be rescoped as well.

###### Product Requirements

Navigate to the ‘Product requirements’ Tab to see a list of product requirements. 

The requirements are grouped by product categories and collapsed by default.

<img src="media/image102.png" style="width:7.90625in;height:3.84375in" />

To expand the product category, click on ‘Arrow’ icon.

<img src="media/image103.png" style="width:7.9in;height:3.84514in" alt="A screenshot of a computer AI-generated content may be incorrect." />

You will see requirement name, description, Must/Should value (criticality of the requirement implementation), sources, and requirement status.

<img src="media/image104.png" style="width:7.9in;height:3.91597in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Hover over ‘More’ link in the description column to see full description of the requirement.

<img src="media/image105.png" style="width:7.9in;height:3.83542in" alt="A screenshot of a computer AI-generated content may be incorrect." />

To change the status, click on three dots next to status label, select status from the list, provide evidence and justification if needed.

<img src="media/image106.png" style="width:3.16711in;height:2.87435in" />

To edit process or product requirements in bulk, use checkboxes to select the requirements you want to edit. If you want to select parent requirement and it has sub-requirements, a sub-menu appears with two options: Select Parent Only and Select Parent and Its Sub-Requirements:

<img src="media/image107.jpg" style="width:7.90625in;height:3.57292in" />Additionally, you can select all requirements and there are two options: \`Select Parent Requirements’ and \`Select Parent and Sub-requirements':

<img src="media/image108.png" style="width:7.90625in;height:3.85417in" />

A pop-up will appear where you need to select status from the list, provide evidence and justification if needed:

<img src="media/image109.png" style="width:7.90625in;height:3.625in" />Once requirements are selected, click ‘Edit’ in Bulk Actions section:

<img src="media/image108.png" style="width:7.90625in;height:3.85417in" />A pop-up will appear where you can update status, evidence link and justification for selected requirements:

<img src="media/image110.png" style="width:7.90625in;height:3.82292in" />

You can search the requirement by its name, filter by product category, sources and requirement status.

There is also a group of toggle buttons to work with requirements display (the same as for Process Requirements Tab): Show sub-requirements, show all requirements (which were not scoped for the release) and show only new requirements (that was added to the system after release creation and questionnaire re-submission)

<img src="media/image111.png" style="width:7.90625in;height:0.94793in" />

###### 2.6.2.1.6. Process and Product Requirements Status upload

In addition to the manual edits of the Process and Product requirement's and sub-requirement's status, the Product Team and Security/Privacy Advisor (acting on behalf of the Product Team) can update the completion status of the requirements/sub-requirements with the file upload.

| **Responsible roles** | Product Owner, Security Manager and Security Advisor/Privacy Advisor (acting on behalf of the Product Team) |
|----|----|
| **Release flow stages** | Creation & Scoping, Review & Confirm, Manage |

Users can upload requirements using Excel export file to streamline updates and manage requirements efficiently. Additionally, the functions and rules governing requirements file uploads are explained in detail.

####### 2.6.2.1.6.1. Requirements File Upload Overview

Users can update Process and Product requirements statuses by exporting the list of requirements via clicking on ‘Export XSLX’ button:

<img src="media/image112.png" style="width:7.90625in;height:3.83333in" />

The downloaded file will contain two tabs: Instructions and Data. On the ‘Instructions’

Tab there is guidance on how to fill in the information on the Data tab. Please note, that you can only edit ‘Status’, ‘Evidence’, and ‘Justification’ columns. If you change something in other columns, these changes will be skipped by the system.

For products managed in Jira, on the ‘Data’ tab there will be additional column called ‘Source link’, if the requirement is sent to Jira. If you try to update the status, evidence or justification for such requirements, the changes won’t be applied, because the requirement status can be only edited in Jira.

Once you’ve updated the required information, save the changes and upload the file back to the system using the ‘Import XSLX’ button.

<img src="media/image113.png" style="width:7.90625in;height:3.875in" />Once the file is added, the system shows an information message:

<img src="media/image114.png" style="width:7.90625in;height:3.78125in" />While uploading is in progress, it will be displayed under Import/Export buttons:

<img src="media/image115.png" style="width:3.2192in;height:0.91679in" />

In case of any errors, it will be displayed in the same place:

<img src="media/image116.png" style="width:4.1985in;height:1.02098in" />

To see which rows contain the error, click on ‘Errors’ link and the system will open a pop-up. Correct the mistakes and upload the file again.

<img src="media/image117.png" style="width:7.90625in;height:3.84375in" />File upload takes some time. After successful upload the page will be refreshed automatically.

You can remove rows in the file, if you need to update only specific requirements. The requirements order corresponds to the order in the Backoffice. You can change the order at your convenience. But removing/reordering of the columns is prohibited. If some changes were made in the columns order and you try to upload such file, the system will return an error:

<img src="media/image118.png" style="width:7.90625in;height:3.85417in" />

###### 2.6.2.1.7. Process and Product Requirements Summary

Requirements Status Summary feature is available on the Process Requirements and Product Requirements pages. This feature provides a visual summary of the status of all requirements scoped (or manually added) for a release in the form of a pie chart.

<img src="media/image119.png" style="width:7.9in;height:3.88194in" alt="A screen shot of a computer AI-generated content may be incorrect." />

On the **Process Requirements** and **Product Requirements** pages, users will see a new link: **"Requirements Status Summary"**

<img src="media/image120.png" style="width:7.9in;height:3.30347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Clicking this link will open a pop-up window that contains the following:

- A pie chart diagram showing the percentage breakdown of requirements based on their current statuses.

- Functions for filtering and customizing the data visualized on the pie chart: filter by SDL Practice/Category, Source (for Product Requirements) and ‘Include Sub-requirements’ toggle button (disabled by default).

<img src="media/image121.png" style="width:7.9in;height:4.16458in" alt="A screenshot of a computer AI-generated content may be incorrect." />

When the **Requirements Status Summary** chart is opened, it will show:

1.  **All scoped and manually added requirements for the release**, aggregated for the respective tab (Process Requirements or Product Requirements).

2.  The requirements will be grouped by their statuses, and each slice of the pie chart will show:

    - Status (e.g., Done, In Progress, Not Applicable, Planned, Postponed)

    - The percentage and number of requirements in that status calculated from the total.

For example:  
If for the **"Secure by Design"** practice there are 17 requirements:

- **4 are Done** = 23.53% of the total

- **4 are In Progress** = 23.53%

- **4 are Not Applicable** = 23.53%

- **2 are Planned** = 11.76%

- **3 are Postponed** = 17.65%

To focus on specific data, users can filter the requirements shown in the pie chart:

**1. Filter by SDL Practice/Category**

Users can select a specific **SDL Practice** or **Category** (e.g., "Secure by Design," "Threat Modeling"):

- The pie chart will be updated to show the status of requirements only for the selected practice or category.

<img src="media/image122.png" style="width:3.53901in;height:1.88803in" alt="A screenshot of a computer AI-generated content may be incorrect." /> <img src="media/image123.png" style="width:3.50566in;height:1.88873in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**2. Toggle "Include Sub-Requirements"**

A toggle button labeled **"Include Sub-Requirements"** allows users to decide whether to include sub-requirements in the chart:

- **By default**: This toggle is deactivated, and only the status of the top-level requirements is shown.

- **When activated**: The chart also counts the status of sub-requirements toward the total.

<img src="media/image124.png" style="width:7.9in;height:4.24514in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Important Notes for Process Requirements:**

- If the **"Show the Process sub-requirements within Release Management process"** toggle (found on the Product Details page) is **deactivated**, the **"Include Sub-Requirements"** toggle will be **hidden** for Process Requirements, as sub-requirements are not relevant in this case.

**How Toggle Affects the Chart**

For example:  
If there are 17 requirements, including 5 sub-requirements:

- With the **toggle deactivated**, only the status of the 12 top-level requirements is shown.

- With the **toggle activated**, the status of all 17 requirements (including sub-requirements) is visualized.

**How Percentages Are Calculated in the Chart**

The percentage of each status is calculated as:  
**(Number of requirements in the status / Total number of requirements) × 100%**

For example:  
If 17 requirements apply (including manually added ones):

- **4 Done**: 4 / 17 × 100% = 23.53%

- **4 In Progress**: 4 / 17 × 100% = 23.53%

- **4 Not Applicable**: 4 / 17 × 100% = 23.53%

- **2 Planned**: 2 / 17 × 100% = 11.76%

- **3 Postponed**: 3 / 17 × 100% = 17.65%

Each slice of the pie chart will display the percentage and number of requirements for that status.

**User Interface Elements in the Pop-Up**

The pie chart pop-up includes the following components:

**1. Pie Chart Diagram**

- A graphical representation of the status distribution of the requirements.

- Dynamic updates based on filters and toggles.

**2. SDL Practice/Category Filter**

- A dropdown menu showing all SDL Practices or Categories.

- Selecting a practice/category will update the chart to reflect the filtered requirements.

**3. Toggle: "Include Sub-Requirements"**

- Allows users to include or exclude sub-requirements from the data.

**4. Burger Menu icon:**

- **View full screen**

- **Print Chart**

<!-- -->

- **Download** options are available to export the chart in PNG, JPEG, and SVG Vector format.

<img src="media/image125.png" style="width:6.89226in;height:3.68365in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Error Scenarios**

**1. No Data Available for Selected Filter**

If no requirements match the selected SDL Practice/Category filter:

- The pie chart will display a message:  
  **"No data to display"**

> <img src="media/image126.png" style="width:7.9in;height:4.20972in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**2. Toggle Visibility for Process Requirements**

If **"Show the Process sub-requirements within Release Management process"** is deactivated:

- The **"Include Sub-Requirements"** toggle will not appear for the **Process Requirements** tab.

###### 2.6.2.1.8. Adding Project-specific (Custom) Requirements to the Product Requirements Tab 

Custom Requirements in PICASso allow users to define, upload, edit, and remove project-specific requirements for a product release. This chapter explains how to add, bulk upload, edit, and remove custom requirements, including validation rules, access privileges, and release history logging.

- On the **Product Requirements** tab, users with the appropriate privilege will see the **"Add Custom requirements"** button (it is available on Creation&Scoping and Review&Confirm stages) :

<img src="media/image127.png" style="width:7.9in;height:3.85417in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Clicking the button opens a pop-up with the following fields:

<img src="media/image128.png" style="width:7.9in;height:3.85417in" alt="A screenshot of a computer AI-generated content may be incorrect." />

| Field | Type/Control | Mandatory | Description |
|----|----|----|----|
| Name | Free Text | Yes | Name of the requirement (displayed in the list). |
| Code (ID) | Free Text | Yes | Unique identifier. If already exists, error: "Requirement with this code already exist". |
| Condition | Radio Buttons (Must/Should) | Yes | Select "Must" or "Should". |
| Category | Read Only | N/A | Default: "Custom Requirements". |
| Description | Free Text | Yes | Full description of the requirement. |
| Source | Free Text + Dropdown | Yes | Type the source manually using ‘Add Source’ button or select from existing sources for custom requirements in this release. |
| Add as a sub-requirement | Toggle Button | N/A | When enabled, shows "Parent requirement" field. Disabled (greyed out) if no custom parent requirements exist. |
| Parent requirement | Dropdown | Yes (if sub-requirement) | Select from existing custom parent requirements. |
| Download template | Button | N/A | Downloads the template file to the user's device. Use Import XSLX button on the Product Requirements tab to upload the template. In case some errors exist in the file, it will be displayed under ‘Import XSLX’ button. |

When all information has been provided, click ‘Add’.

<img src="media/image129.png" style="width:7.9in;height:3.86875in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Newly added requirement will appear in the list on the product requirements tab under ‘Custom Requirements’ category:

<img src="media/image130.png" style="width:7.9in;height:3.88125in" alt="A screenshot of a computer AI-generated content may be incorrect." />

When at least one ‘parent’ requirement is added to the release, it is possible to create sub-requirements. To do so, click ‘+Custom requirements’ again and in the opened pop-up enable ‘Add as sub-requirement’ toggle button, then select parent requirement code from the dropdown list:

<img src="media/image131.png" style="width:7.9in;height:3.86806in" alt="A screenshot of a computer AI-generated content may be incorrect." />

As you’ve added at least one source when creating a parent requirement, now you can select the same source for sub-requirement or create a new source.

<img src="media/image132.png" style="width:7.9in;height:3.79792in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image133.png" style="width:7.9in;height:3.85833in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Additionally, provide all the details of the sub-requirement and click ‘Add’. New sub-requirement will be displayed in the list under its parent:

<img src="media/image134.png" style="width:7.9in;height:3.85347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Also there is a possibility to add custom requirements in bulk, by downloading a template and uploading it back to the system.

To download a template for custom requirements, click ‘+Custom Requirement’, and find the corresponding link:

<img src="media/image135.png" style="width:7.9in;height:3.84583in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Clicking this link triggers downloading a file. In the template there are two tabs:

- Instructions: guidance on how to fill the information;

- Data: a table to provide the details of requirements that need to be added:

<img src="media/image136.png" style="width:7.9in;height:4.12986in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image137.png" style="width:7.9in;height:4.20347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Provide a name, code, parent code (for sub-requirements), description, condition (must/should) and source(s). All fields except parent code are mandatory. If you leave some field empty, the system will return an error. Name and Code are unique values, so they can’t be repeated. If you want to create a sub-requirement via file upload, please specify parent code (id) in the corresponding column. Condition field is a dropdown, so you can select value from the list. If case you want to add several sources for one requirement you can provide comma separated values.

This is an example of the populated table:

<img src="media/image138.png" style="width:7.9in;height:4.64722in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Once the file is ready, save changes and upload it to PICASso using ‘Import XSLX’ button on the Product Requirements tab.

<img src="media/image139.png" style="width:7.9in;height:3.86944in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image140.png" style="width:7.9in;height:3.87361in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If the template has errors, it would be shown under ‘Import XSLX’ button. Clicking ‘Errors’ link opens a pop-up with the list of errors and specifying what line contains error:

<img src="media/image141.png" style="width:7.9in;height:3.89444in" alt="A screenshot of a computer AI-generated content may be incorrect." />

In case of successful upload the requirements will be created and appear in the list.<img src="media/image142.png" style="width:7.9in;height:3.86389in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Number of custom requirements is displayed at the bottom of the page:

<img src="media/image143.png" style="width:7.9in;height:3.83056in" alt="A screenshot of a computer AI-generated content may be incorrect." />

It is possible to remove custom requirements if it is no longer needed. To do so, click ‘Three dots’ icon in the Actions column, then click ‘Remove’. In the opened pop-up provide mandatory rationale for removal.

<img src="media/image144.png" style="width:7.9in;height:3.82014in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image145.png" style="width:7.9in;height:3.75278in" alt="A screenshot of a computer AI-generated content may be incorrect." />

The status of removed requirement will be changed to ‘Not Selected’ and it will be hidden. To see the requirements with ‘Not Selected’ status enable ‘Show all requirements’ toggle button. You can also add removed requirement back using ‘Add’ button in the Actions column and providing rationale for adding (optional).

To remove custom requirements or add removed ones use checkboxes to select them and ‘Add’ and ‘Remove’ buttons in Bulk Actions section.

<img src="media/image146.png" style="width:7.9in;height:3.85139in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image147.png" style="width:7.9in;height:3.79583in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image148.png" style="width:7.9in;height:3.84236in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Custom Requirements Handling**

Custom requirements are managed like other requirements:

- Can be sent to Jira/Jama on the Manage stage

- Status, evidence link and justification can be updated (manually, in bulk, via file upload)

- Included in the Export XLSX file.

- If the release is cloned, custom requirements are cloned as well.

- Fields for custom requirements are added to GetReleaseProductRequirements Data Extraction API method.

- Adding/Updating/Removal of custom requirements is logged in the release history under ‘Requirement Status Update’ activity.

- Custom requirements are available for evaluation on the Cybersecurity Residual Risks tab – Product Requirements Summary section.

<img src="media/image149.png" style="width:7.9in;height:6.08333in" alt="A screenshot of a computer AI-generated content may be incorrect." />

###### 2.6.2.1.9. Product & Process Requirements Versioning

After major change for requirements version in PICASso admin panel – BackOffice (e.g., modifications of name, description, trigger, activation/deactivation, or the creation of new requirements affecting scoping), this update is reflected accordingly in the releases in statuses Scoping, Scope Approval and Manage, where users can select if they wish to switch to the new requirements version (or keep the current version of the requirements).

For releases where scoping can still be updated (Scoping, Scope Approval, In Progress), a warning message is shown in the release with the possibility to review added changes and confirm the version update or keeping the current version.

“Newer version of requirements is available. Please review and update statuses if needed. Learn more.”

<img src="/media/image167.png" style="width:7.90625in;height:4.03125in" />

**Note:**

- If release was created as a clone of existing release, message displayed would have the following wording: “Requirements were cloned from release \<version\> and newer version of requirements is available. Please review and update statuses if needed. Learn more”

<img src="/media/image168.png" style="width:7.90625in;height:4.03125in" />

- Warnings are not shown for: FCSR Readiness Review, Final Acceptance, Issue Closure, Completed, Cancelled, Inactive releases (These releases can no longer accept updated requirements.)

Clicking **Learn more** opens the Requirements Update pop-up, which includes:

<img src="/media/image169.png" style="width:7.90625in;height:4.04167in" />

1.  Change summary table include:

- Requirement (code + name)

- Date when mandatory changes will apply (if scheduled)  
    
  **Note:** Even if the change to the new version is not confirmed from this pop-up by the user or is not added after the risk or questionnaire is updated, such changes scheduled for specific date will be automatically updated for the releases in statuses Scoping and Scope Approval on this specified date.

- Old description – description used for the previous version of the requirement (would be available if Change type = Updated or Removed).

- New description - description added for the new version of the requirement (would be available if Change type = Updated or Added).

- Change type:

  - Updated – existing requirement description or name is changed.

  - Added – condition for triggering the requirement is updated, so it now becomes applicable for the release or new requirement is added and it is applicable for this product/release.

  - Removed – condition for triggering the requirement is updated, so it is now removed from the scope of release or requirement is deactivated and it is no longer applicable for this product/release.

2.  User decision area

Users with the privilege to update the requirements version in the release can choose:

- No, keep the current version – warning remains

- Yes, change the version – triggers rescoping of the requirements and update to the newer version  
    
  **Note:** If at least one requirement that was updated has a status ≠ Planned -\> then the Updated Requirements Status pop-up is shown which allows the user to select status of which requirements should be reset to “Planned” as they have to be updated by the team due to the changes in the description:

  - If any requirement should be reset to “Planned”, the user should select this requirement by ticking the checkbox before the requirement and clicking on the activated button “Reset Selected”. Upon clicking on this button, the requirements set is updated to a newer version and those requirements that were selected to be reset – are now having status “Planned” in the release.

  - If no requirement should be reset to “Planned”, the user can click the button “No, keep the status unchanged”. Upon clicking on this button, the requirements set is updated to a newer version, but all requirements remain with unchanged status.

<img src="/media/image16a.png" style="width:7.90625in;height:3.80212in" />

3.  Content Changes link - Opens the new Content Changes pop-up in a separate tab with the “Content” filter applied. On this page, the user can review the reason for the current change version and understand if specified changes should be added or not.

<img src="/media/image16b.png" style="width:7.90625in;height:3.84378in" />

The user can also close the “Requirements Update” pop-up by clicking “Close” or “No, keep the current version” button and the version of requirements remain unchanged, unless the user does not update the questionnaire, the Risk Classification or the Data Protection & Privacy Risk for the release:

<img src="/media/image16c.png" style="width:7.90625in;height:3.98958in" />

Minor changes (like update of the SDL Practice, Category for requirement, accountable roles) to requirements are now automatically reflected in applicable releases without the need for rescoping.

Automatically applied to releases in these statuses: Scoping, Scope Approval, In Progress, FCSR Readiness Review, Final Acceptance, and Issue Closure.

Additional behaviors:

- Cloned releases automatically include all minor updates made after the source release was completed/cancelled/inactivated.

- No minor updates are applied to: Completed, Cancelled, and Inactive releases.

If major changes have already been added through the Questionnaire updates, Risk updates, Privacy updates, or Mandatory scheduled change date, the system shows an informational message: “The latest version of the requirements has been applied in this release. Learn more.”

<img src="/media/image16d.png" style="width:7.90625in;height:4.03125in" />

The user can review the applied updates via the same Requirements Update pop-up, but without possibility to edit the version (as the version was already edited):

<img src="/media/image16e.png" style="width:7.90625in;height:4.0625in" />

Note: informational message can be shown in combination with the warning message as this push can update the requirements partially depending on the date specified.

<img src="/media/image16f.png" style="width:7.90625in;height:4.03125in" />

**Note:** Informational messages remain until the release reaches **F**CSR Readiness Review status .

###### 2.6.2.1.10. Delegated Requirements Traceability

This chapter explains how to manually and in bulk update the status of requirements to "Delegated" within the Process/Product Requirements tabs. It covers the steps for delegation, fields behavior, validations, and how to use file upload for delegation details updates.

**1. Manual Requirement Status Update**

To delegate a requirement:

- In the Process/Product Requirements tabs, click the three dots next to the requirement status and select **Delegated**.

- Alternatively, click **View/Edit** in the Actions column, then **Edit** again.

A pop-up window will appear, allowing you to provide evidence links and justification for delegation. When you select the **Delegated** status, the following additional fields are available:

**Product Name -** select a product to which the requirement is delegated from the list. You can search by Product ID or Product Name. If the product is not found, select **Other Product** option (always at the top of the list).

**Other Product –** enter the product name manually if the product is not found (‘Other’ option selected in the ‘Product Name’ field).

**Contact Person -** select the person responsible for requirement implementation. Available if product or release is not found in the system.

**Product Release -** select a release from the list for the chosen product. If not found, select **Other Release** option. If "Other Product" is selected, this field becomes a free text entry.

**Release Requirement -** Select a requirement from the chosen release. Search by Requirement Code or Name. The list adapts based on whether you are delegating process or product requirements. If not found, select **Requirement Not Found** and enter the code/name manually.

**Status -** read-only**,** displays the current status of the selected requirement.

**Evaluation Status -** read-only**,** displays the evaluation status of selected ‘delegated to’ requirement, updated in real time.

**Due Date -** select a due date for completion. If left empty, a confirmation pop-up will appear when saving.

**Delegated Requirement Part -** specify which part of the current requirement is covered by the delegated requirement.

<img src="/media/image170.png" style="width:7.90625in;height:3.82292in" />

**Adding and Removing Products and Requirements**

- **Add Product:** Click **+Add Product** to delegate to multiple products. Each click adds a new form with the fields above.

- **Add Requirement:** Click **+Add Requirement** to delegate multiple requirements within one release.

<img src="/media/image171.png" style="width:7.90625in;height:3.86458in" />

- **Remove Product:** Click **Remove Product** in each form to remove a product. If all products are removed, an empty form remains. A confirmation pop-up will appear.

- **Remove Requirement:** Click **Remove Requirement** to remove a requirement. A confirmation pop-up will appear. If all requirements are removed, an empty field remains visible.

<img src="/media/image172.png" style="width:7.90625in;height:3.79167in" /><img src="/media/image173.png" style="width:7.90625in;height:3.85417in" />

If you attempt to save without specifying a due date, a confirmation pop-up will appear:

*"You haven’t specified a due date for requirement(s) delegated to the following products: … . Are you sure you want to save requirement without setting it?"*

<img src="/media/image174.png" style="width:7.90625in;height:3.8125in" />

**2. Bulk Requirement Status Update**

When updating multiple requirements at once:

- In the bulk status update pop-up, selecting **Delegated** displays all fields described above.

- You can add multiple products, requirements, due dates, and comments.

<img src="/media/image175.png" style="width:7.90625in;height:3.83333in" />

- If you selected some requirements that already have delegation details and select ‘Delegated’ status, additional confirmation pop-up appears: Requirements ‘name 1, name 2’ of responsibilities already have delegation details. They will be overwritten with new details you specified. Do you wish to proceed?

> <img src="/media/image176.png" style="width:6.5in;height:3.14583in" />

**3. File Upload Requirement Status Update**

You can update requirement status via file upload (Export-Import XLSX feature). There is a tab in the file called ‘Delegation Details’, on this tab you need to provide the following information:

- Requirement Code – provide the code of requirement from ‘Data’ tab that has ‘Delegated’ status.

- Requirement Name – provide delegated requirement name

- Delegated to Product ID – provide product ID (format: PIC-xxx) to which you delegate the requirement if this product is registered in PICASso

- Delegated to Product Name – provide the name of the product if it does not exist in PICASso.

- Delegated to Release ID – provide ID of the release you delegate the requirement to (for products that exist in PICASso)

- Delegated to Release Version – provide release name if it is not registered in the system.

- Delegated to Requirement Code – provide requirement code if it exists in PICASso

- Delegated to Requirement Name – provide requirement name if the requirement is not scoped for the release or if the release isn’t registered in the system.

- Delegation Due Date (optional) – provide the desired date of requirement completion in the format YYYY-MM-DD

- Delegated Requirement Part (optional) – specify what part of the requirement should be covered.

- Delegated from Product - read-only, appears if at least one requirement has delegated requirements

- Delegated from Release - read-only, appears if at least one requirement has delegated requirements

- Delegated from Requirement - read-only, appears if at least one requirement has delegated requirements

<img src="/media/image177.png" style="width:7.90625in;height:3.11458in" />

In case of any error it is displayed with line numbers under Import XSLX button for easy identification.

**4. API Status Update (Jira/Jama)**

If a requirement is submitted to Jira/Jama and then after the synchronization have ‘Delegated’ status in PICASso, a warning sign with a tooltip appears next to the requirement status in the list of requirements.

<img src="/media/image178.png" style="width:7.90625in;height:3.72917in" />  
If at least one requirement has a warning, a confirmation pop-up appears when submitting a release to the next stage.

<img src="/media/image179.png" style="width:7.90625in;height:3.85417in" />

**5. Display in Linked Requirement**

When Product, Product Release, and Requirement fields are populated, this information appears in the specified release’s requirement info and edit pop-ups.  
The **Delegated Requirements** section is collapsible and includes a tooltip.

- Requirement Name, Status, Delegated from Product, Delegated from Release, Comment, and Due Date are non-editable but clickable, leading to the selected product/release/requirement in read-only mode.

<img src="/media/image17a.png" style="width:7.90625in;height:3.77083in" />

##### Onboarding Release

If you are moving your existing product to PICASso and already follow SDL/FCSR process you should onboard your product through the release.

###### Release Details

If the product is an existing product, use the steps below for the workflow. These are the same things you would use for a new product release.

<img src="media/image150.png" style="width:7.90625in;height:3.77083in" />

The only additional step will be to provide the dates of the 'Last Full Pen Test Date' and the 'Last BU Security Officer FCSR Date' (mandatory field), as indicated above. ‘Last Full Pen Test Date’ field is optional. When clicking on ‘Create&Scope’ button, if you haven’t provided this date, the system will show a warning:

<img src="media/image151.png" style="width:7.90625in;height:5.94792in" />You will be able to provide Last Full Pen Test details later, on the ’Manage’ stage on the Cybersecurity residual risks tab in the ’Security defects’ section.

<img src="media/image152.png" style="width:7.9in;height:3.89375in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Fill in the ‘Change Summary’ field and click ‘Submit’.

###### 2.6.2.2.2. Release Created Based on Other Release (Сlone Release)

Each release is a product evolution and is based on the code of the previous release. To keep track of already implemented requirements and yet to be implemented the inheritance feature is implemented in PICASso. To leverage the benefits of using this functionality the user should follow the steps outlined in the sections below.

1.  Go to “Product” from “My Products” tab on the Home page.

2.  Open “Releases” tab on the “Product” form.

3.  Choose the release from the list you want to use as a basis for new release

4.  Click on “Clone” button in the Actions column

<img src="media/image153.png" style="width:7.90625in;height:3.80208in" />

5.  Enter the release details in the popup window:

<img src="media/image154.png" style="width:7.90625in;height:3.90625in" />

6.  When the data is entered and saved a new release is created.

7.  Open the newly created release and check that the following data is copied from the referenced release:

    1)  **Release details tab**: Continuous Pen Test Contract Date, Last Full Pen Test Date, Last BU Security Officer FCSR Date

<img src="media/image155.png" style="width:7.90625in;height:3.92708in" />

2)  **Roles & Responsibilities**: Product Team table

3)  **Questionnaire**: all the answers that were given in the previous release.

System Behavior with Updated Questionnaires:

If new or updated questions exist within the questionnaire:

> 1.1. A warning icon will be displayed.
>
> 1.2. Users must review and respond to all new or updated questions.
>
> 1.3. After questionnaire re-submission the system will regenerate and display new Process and Product Requirements. Previously implemented process requirements will remain in ’Done’ status and will be shown in the list. Product requirements done in previous releases will be hidden, but you can view them using ‘Show All Requirements’ toggle button. Such requirements will have ‘On a previous release’ label.

4)  **Process/Product Requirements**:

> Copied data: All requirements and sub-requirements regardless of their status. Evidence links, justification and source links (if managed in Jira/Jama) will be copied too.

5)  **Review&Confirm tab:** – no data is copied to the cloned release.

6)  **Cybersecurity Residual Risks:**

| **Section** | **Copied Data** | **Excluded Data** |
|----|----|----|
| SDL Processes Summary | Evaluation Statuses of the requirements | SDL Details, actions and Residual Risk |
| Product Requirements Summary | Evaluation Statuses of the requirements | Cybersecurity Requirements Roadmap link, actions and Residual Risk |
| System Design | System Design Information, Components, Countermeasures, Residual Risk | Actions |
| Threat Model | All information (including links and residual risk) | Actions |
| 3<sup>rd</sup> Party Suppliers&SE Bricks | TPS Products, SE Bricks, Libraries, Libraries, and Platforms, Residual Risk | Actions |
| Static Code Analysis | SCA Tools, Residual Risk | Actions |
| Software Composition Analysis | SCA Tools, Residual Risk | Actions |
| FOSS Check | All information | Actions |
| Security Defects | SVV Test Issues, Pen Test Details, Residual Risk | Actions |
| External Vulnerabilities | External Vulnerability Issues, Residual Risk | Actions |

**FCSR Review Tab: No data is copied**.

**Validation and Rules for Cloning**

- Release Version:

  - Must be unique (cannot replicate the name of an existing release)

- Target Release Date:

  - Past dates cannot be selected.

- Change Summary:

  - Optional free-text field to provide additional context about the cloned release.

5\. Post-Cloning Actions

After cloning a release:

1.  Warning for Updated Questionnaires:

    - If the Questionnaire includes new or updated questions, users must review and respond to them before proceeding.

    - Process and Product Requirements together with Risk Classification and Data Protection and Privacy Risk will be updated automatically based on the new responses. Risks can also be updated manually at the Review&Confirm stage by Scope Approver.

2.  View the Cloned Release:

    - The cloned release is visible on ‘My Releases’ tab of the product.

3.  Complete Missing Data:

    - Users should update any required fields, actions, or information not carried over during the cloning process.

###### 2.6.2.2.3 Last Full Pen Test Date and Last BU Security Officer FCSR Date Cloning Behavior

If these fields were populated in the first (onboarding) release, they will be updated in the following cases:

- If the full pen test was performed as part of source release, the new date must be specified in the Security Defects Section of CSRR tab. Once the release is cloned, this date will be populated in the release details of the cloned release.

<img src="media/image156.png" style="width:7.9in;height:3.81667in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- If full pen test wasn’t performed as part of the source release, then the date specified in the release details will be copied to the cloned release.

- If in the initial release FCSR was performed by BU Security Officer, the date of FCSR completion will be populated in the cloned release.

- If in the initial release FCSR was performed by SA or LOB Security Leader, then Last BU Security Officer FCSR Date will be copied to the cloned release as specified in the release details of initial release.

- If these fields were empty in the initial release, the above described logic will be applied as well.

##### Release Submit for Review

Once the user has completed work on the questionnaire, reviewed and decided on the process and product requirements for inclusion in this release, they can submit the release for review. This is done by the Product Owner/Security Manager and can be submitted by clicking on the 'Submit for Review' button.

<img src="media/image157.png" style="width:7.9in;height:3.88819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Upon successful submission, a notification will be displayed at the top of the screen. The release status and the stage of the release workflow will also be updated accordingly.

<img src="media/image158.png" style="width:7.9in;height:3.81111in" alt="A screenshot of a computer AI-generated content may be incorrect." />

The task “Review and Confirm” will be created and added to the “My Tasks” list for the individual who is in charge of doing it according to the routing logic rules.

<img src="media/image159.png" style="width:6.69375in;height:1.48472in" alt="A screenshot of a computer Description automatically generated" />

#### Review & Confirm

The Security Advisor, LOB Security Leader, or BU Security Officer will get an email notification about the new release submitted for scope review and confirmation. They can get to the PICASso release form from the email clicking on the release link or login to PICASso and either:

1)  Open “My Releases” tab filter by status equal to “Scope Approval”

<img src="media/image160.png" style="width:6.69375in;height:1.51528in" alt="A screenshot of a computer Description automatically generated" />

2)  Go to “My Tasks” and filter by Name equal to “Review and Confirm”

<img src="media/image161.png" style="width:6.69375in;height:1.71111in" alt="A screenshot of a computer Description automatically generated" />

As a reviewer, the user can execute all actions that were available in the previous stage of the workflow. They can:

1)  Change the requirements status and provide comments.

<img src="media/image162.png" style="width:6.885in;height:3.375in" alt="A screenshot of a computer Description automatically generated" />

2)  Add new requirements from the list

<img src="media/image163.png" style="width:6.875in;height:3.34389in" alt="A screenshot of a computer Description automatically generated" />

3)  Correct the answers in the questionnaires.

4)  Change the Privacy Risk and Risk Classification. It is mandatory to provide a justification for updating these fields.

**NOTE!!!** Any changes in the questionnaire will trigger the recalculation of the requirements. If the risk classification was changed, the approver will be changed as well. For example, Minimum Oversight Level of the product is ‘Team’ and calculated risk is ‘Major’. If the Scope Reviewer changes the risk to ‘Minor’, the approver will be changed to LOB Security Leader.

<img src="media/image164.png" style="width:6.16252in;height:2.97917in" alt="A screenshot of a computer Description automatically generated" />

<img src="media/image165.png" style="width:6.01807in;height:2.40685in" alt="A screenshot of a computer Description automatically generated" />

5)  Review aggregated information about requirements and previous FCSR&PCC decisions, give scope review participant’s recommendations and/or actions if needed, store details about key discussion topics, and provide Scope Review Decision on the Review & Confirm tab.

<img src="media/image166.png" style="width:7.90625in;height:4.17708in" /><img src="media/image167.png" style="width:7.90625in;height:3.90625in" /><img src="media/image168.png" style="width:7.90625in;height:2.89583in" />

After completing the review, the user should click on the 'Submit' button. This will officially move the release advancing it to the next stage. The task will be created for Product Owner and Security Manager. An email notification will also be sent to the relevant group of individuals.

<img src="media/image169.png" style="width:6.20833in;height:3.00436in" alt="A screenshot of a computer Description automatically generated" />

It is possible to send the release to rework if needed. To do so, click on ‘Rework’ button and provide a justification in the opened pop-up:

<img src="media/image170.png" style="width:7.9in;height:3.8375in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image171.png" style="width:7.9in;height:3.82083in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### Manage

Once the release scope is approved, Product Owner and Security Manager will get a notification by email and can get to the release right from email body by clicking on the link with a release number or opening a task in the “My Tasks” list. The main goal is to update statuses of the requirements and provide evidence during the release, filling the data in the cybersecurity residual risks tab, and at the end of the stage when it is ready for SA&PQL sign off and FCSR from a product development team perspective, enter a product manager and/or security manager recommendation on FCSR decision. If the product team sees any action required, they can create them. Below you can find detailed instructions on how to fill the necessary sections.

##### Process & Product Requirements Manual Update

If product development is not tracked in Jira the user should manually update the statuses of the product and process requirement tabs and provide links to the place where the evidence is stored.

You can update either:

1)  Each requirement by clicking on “Edit” button in the row and filling the “Status”, “Evidence Link”, and “Justification” fields.

<img src="media/image172.png" style="width:7.9in;height:3.87708in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image173.png" style="width:7.9in;height:3.85347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image174.png" style="width:7.9in;height:3.83333in" alt="A screenshot of a computer AI-generated content may be incorrect." />

2)  Select multiple requirements and click on ‘Edit’ button in Bulk Actions’ section (in the same way as on the Creation&Scoping stage).

> <img src="media/image175.png" style="width:7.90625in;height:3.60417in" />

<img src="media/image176.png" style="width:7.9in;height:3.87292in" alt="A screenshot of a computer AI-generated content may be incorrect." />

##### Process & Product Requirements Bulk Update

1.  Export a file containing all the scoped requirements by clicking on ‘Export XLSX’.

<img src="media/image177.png" style="width:7.90625in;height:3.80208in" />

2.  Make changes in the file (update Status, Evidence, Justification), save changes.

Status should be selected from the dropdown:

<img src="media/image178.png" style="width:7.82401in;height:3.99014in" />

Evidence field must be filled in if the status is ’Done’ or ‘Partial’.

Justification must be provided if the status is ‘Done’, Postponed’, ‘Not Applicable’, ’Delegated’.

<img src="media/image179.png" style="width:7.90625in;height:5.09375in" />

3.  Upload the file back using ‘Import XSLX’ button.

<img src="media/image180.png" style="width:7.90625in;height:3.84375in" />4. Important notes:

Do not remove/reorder tab (Instructions and Data tabs should be left as is).

Do not change the order or remove the columns.

If you make changes to the columns other than Status, Evidence, Justification, these changed won’t be taken into account.

For the products managed in Jira, you will see additional ‘Source Link’ column on the ‘Data’ tab. If the requirement is managed in Jira (Source Link is populated), do not change the status, evidence or justification, it won’t be taken into account. The status of such requirements can be changed ONLY in Jira.

###### 2.6.4.2.1. Process & Product Requirements Submit to JIRA

If the requirements are tracked in Jira and Jira connection settings are provided for this product in PICASso (see section [New Product Creation)](#new-product-creation) the user will be able to send Process & Product requirements on the “Manage” stage to Jira by clicking on “Submit to Jira” button.

Before submitting requirements to Jira, a person that manages project in Jira (it can be Product Owner or Security Manager), should grant ‘Administrators’ role for the user ‘PICASso Jira’.

To do so, go to Jira, click on ‘Gear’ icon – Projects.

<img src="media/image181.png" style="width:7.90625in;height:0.88542in" />Open your project:

<img src="media/image182.png" style="width:7.90625in;height:3.82292in" />

Scroll down, click on ‘Users and Roles’:

<img src="media/image183.png" style="width:7.90625in;height:3.8125in" />

Click on ‘Add users to a role’:

<img src="media/image184.png" style="width:7.90625in;height:2.29167in" />

Search for a user ‘PICASso Jira’, click on it and add role ‘Administrators’ from the dropdown list in the ‘Role’ field. Click ‘Add’.

<img src="media/image185.png" style="width:7.90625in;height:2.30208in" />

Now you can submit requirements to Jira. Do not forget to configure status mapping to align Jira statuses with PICASso ones [(Status Mapping Configuration)](#status-mapping-configuration). Select the requirements you want to submit to Jira and click on ‘Submit to Jira’:  
<img src="media/image186.png" style="width:7.90625in;height:3.86458in" />

Note. Requirements in ‘Done’, ‘Not Applicable’, or ‘Delegated’ status won’t be sent to Jira.

The popup window will appear with the list of requirements you’re submitting to Jira, click ‘Submit’:

<img src="media/image187.png" style="width:7.90625in;height:3.8125in" />In the pop-up there is an ’Include sub-requirements' checkbox that is checked by default. If you do not want to include them, just uncheck the checkbox.

If you selected only sub-requirement without their parents, parent requirements would be also added to the scope (if they have ‘Not Selected’ status) and the ticket to be created for them in Jira.

Once the corresponding Jira items are created in Jira the requirements will be updated to include links to Jira objects (Source Link column).

NOTE!!! The Structure will be as follows:

1)  The capability “SDL Process Requirements” and/or “Product Requirements” will be created in Jira;

2)  Each Process or Product Requirement will be created as a feature in Jira;

3)  Each sub-requirement will be created as a user story in Jira.

If the feature/user story for the requirement/sub-requirement already exists and new feature/user story won’t be created.

<img src="media/image188.png" style="width:4.98795in;height:2.50872in" alt="A screenshot of a computer Description automatically generated" />

When all Jira objects are created the work on them continues in Jira. If the status of the feature/user story is changed in Jira it will be synchronized with PICASso. The automatic update/synchronization happens once per day.

However, the user can request the latest updates. To do so, navigate to Process or Product requirements tabs and click on ‘refresh data from Jira’. This step is to synchronize the status of Jira status on PICASso.

<img src="media/image189.png" style="width:7.90625in;height:3.85417in" />

Confirm this step by clicking on ‘Refresh’ button from the dialog box.

<img src="media/image190.png" style="width:7.90625in;height:3.84375in" />

After synchronization, all statuses and source links are updated accordingly.

<img src="media/image191.png" style="width:7.9in;height:3.85903in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Note. If the requirement statuses are not updated after performing ‘Refresh data from Jira’ (and there are no errors on the UI), it might happen that the connection to Jira has been configured, but the status mapping configuration is missing. Please verify that the status mapping between Jira and PICASso is properly configured.

Once the requirements are submitted to Jira, users can click on the 'Source Link' column's link to access the specific Jira ticket. The reporter for this ticket will be listed as PICASso Jira (SESI 018387).

<img src="media/image192.png" style="width:7.90625in;height:4.04167in" />

The assignee could be populated automatically or manually by the Product Owner. For process requirements detailed in the BackOffice, there is a field for an accountable role. If this field is populated, the Jira ticket will be assigned to the specified individual, who could be an architect, developer, pen tester, etc. If no accountable role is specified, the assignee must be manually assigned in Jira by the Product Owner or Security Manager.

For product requirements, the Jira tickets will be automatically assigned to the Product Owner.

There is also a possibility to unlink the requirements if you want to continue to work on them directly in PICASso. To unlink the requirement, select the requirement and click on ‘Unlink’ button:

<img src="media/image193.png" style="width:7.90625in;height:3.875in" />Once a button is clicked, a pop-up will appear where you can include sub-requirements to be unlinked and then confirm unlinking:

<img src="media/image194.png" style="width:7.90625in;height:3.76042in" />After confirmation, the requirement has been successfully unlinked from the Jira ticket.

<img src="media/image195.png" style="width:7.90625in;height:3.80208in" />In case there is a need to relink this requirement to the same ticket, select this requirement and click on ’Relink’ button. Once clicked, a pop-up will be displayed with the date of unlinking and the ticket number in Jira. Click on ’Relink’ again.

<img src="media/image196.png" style="width:7.90625in;height:3.84375in" />The requirement has been successfully relinked:

<img src="media/image197.png" style="width:7.90625in;height:3.84375in" />

It is possible to provide evidence link and/or justification for Jira-submitted requirements. It can be done either manually, in bulk, or via file upload. To do it manually, click three dots in the ‘Actions’ column near the requirement and then ‘View/Edit’.

<img src="media/image198.png" style="width:7.9in;height:3.78125in" alt="A screenshot of a computer AI-generated content may be incorrect." />

A ‘Requirement Info’ pop-up will be opened, click ‘Edit’:  
<img src="media/image199.png" style="width:7.9in;height:3.90486in" alt="A screenshot of a computer AI-generated content may be incorrect." />

‘Edit Requirement’ pop-up will be displayed and here you can provide evidence link and justification:  
<img src="media/image200.png" style="width:7.9in;height:3.87431in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Click ‘Save’ to apply the changes. Once Evidence Link is provided, it will be shown in the corresponding column in the requirements list and in the ‘Requirement Info’ pop-up:

<img src="media/image201.png" style="width:7.9in;height:3.85694in" />

<img src="media/image202.png" style="width:7.9in;height:3.83194in" alt="A screenshot of a computer AI-generated content may be incorrect." />

To add/edit evidence link or justification in bulk, select requirements using checkboxes on the left and click ‘Edit’ in Bulk Actions section.

<img src="media/image203.png" style="width:7.9in;height:3.85694in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If only Jira submitted requirements are selected, then in the pop-up two fields will be available for editing:

<img src="media/image204.png" style="width:7.9in;height:3.87708in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If you select not submitted requirements too, then status can be edited, but only for requirements not managed in Jira:

<img src="media/image205.png" style="width:7.9in;height:3.81528in" alt="A screenshot of a computer AI-generated content may be incorrect." />

To update evidence link and justification via file upload follow these steps:

1\. Click ‘Export XSLX’ button on Process/Product Requirements tab.

<img src="media/image206.png" style="width:7.9in;height:3.88958in" alt="A screenshot of a computer AI-generated content may be incorrect." />

2\. In the downloaded file go to ‘Data’ tab, find the requirements you want to edit, provide necessary information and save changes.

3\. Upload the file back using ‘Import XSLX’ button:

<img src="media/image207.png" style="width:7.9in;height:3.84028in" alt="A screenshot of a computer AI-generated content may be incorrect." />

###### 2.6.4.2.2. Product Requirements Submit to JAMA

If the product requirements are tracked in Jama and Jama Project ID is specified for this product in PICASso (see section New Product Creation) the user will be able to send Product requirements on the “Manage” stage to Jama by selecting specific requirements/sub-requirements and clicking on “Submit to Jama” button.

Before submitting requirements to Jama, a person that manages project in Jama (it can be Product Owner or Security Manager), should grant project administrator role for the service account (SRV001849) in Jama.

Also, the person submitting requirements to Jama from PICASso should have edit permissions for this Jama project. If this person does not have permissions to create requirements in this Jama project, an error would be shown in PICASso upon submission.

After these access permissions are verified and granted, this person can submit requirements to Jama.

Select the requirements you want to submit to Jama and click on the activated “Submit to Jama” button: <img src="media/image208.jpg" style="width:7.9in;height:2.09316in" alt="A screenshot of a computer AI-generated content may be incorrect." />

***Note:** 1) Requirements in statuses "Postponed", "Not Applicable" or "Delegated" can’t be submitted to Jama.*  
*2) When the sub-requirement is selected and sent to Jama, the system should check if the parent requirement was already sent to Jama or not and if not – send it together with these selected sub-requirements.*

The confirmation pop-up window will be opened with the list of requirements that would be submitted to Jama. Click on the ‘Submit’ button to confirm the submission and on Cancel or Close buttons to cancel the submission and close the pop-up:

<img src="media/image209.png" style="width:7.9in;height:4.21221in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Upon clicking the "Submit" button, PICASso will send a request to create requirement object for these requirements in Jama using Orchestra tool as middle layer for such requests management. The requirements successfully received by Orchestra would be added to this Orchestra offer in the Requirements section:

<img src="media/image210.jpg" style="width:7.9in;height:4.01752in" alt="A screenshot of a computer AI-generated content may be incorrect." />

***Note:** 1) Offer in the Orchestra platform does not have to be created before hand - as it would be created automatically upon submission of the 1st portion of requirements from PICASso to Jama.*

*2) If the offer in Orchestra already created for your PICASso product, it would be linked to PICASso product only if it is already linked to the corresponding Jama project. So, if your Orchestra offer is already available, but not yet linked to Jama project – create a request to Orchestra team to link this offer to the desired Jama project.*

If the submission from Orchestra to Jama is successful, when the confirmation of created requirement is received from Jama, link to Jama ticket and Source Status in Jama is added for this requirement and PICASso status is updated based on the **Status Mapping** configured for this product: <img src="media/image211.jpg" style="width:7.9in;height:2.63333in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If the submission was not successful, the corresponding error with description would be displayed in PICASso for these submitted requirements: <img src="media/image212.jpg" style="width:7.9in;height:2.49829in" alt="A screenshot of a computer AI-generated content may be incorrect." />

As soon as Orchestra platform transfer request for the requirements objects creation to Jama, the corresponding requirements would be created in Jama under Customer level -\> Cybersecurity Requirements with sub-requirements linked to their requirements. <img src="media/image213.jpg" style="width:7.9in;height:2.80214in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If the requirement object in Jama already exists - new object won’t be created, but existing one would be updated to match the PICASso library in description, name, must or should value and linkage to the parent.

When all Jama objects are created the work on them continues in Jama. If the status of the Jama requirement object is changed in Jama it will be synchronized with PICASso. The automatic update/synchronization happens once per day - 00:01 UTC).

However, the user can request the latest updates manually. To do so, navigate to Product requirements tab and click on “Refresh data from Jama”. This step is to synchronize the status of Jama object status to PICASso. <img src="media/image214.jpg" style="width:7.9in;height:1.85684in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Confirm this step by clicking on ‘Refresh’ button from the dialog box.

After synchronization, all statuses and source links are updated accordingly. <img src="media/image211.jpg" style="width:7.9in;height:2.63333in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Once the requirements are submitted to Jama, users can click on the 'Source Link' column's link to access the specific Jama object. The reporter for this ticket will be listed as Jama Service account.

For product requirements, the Jama tickets would be automatically assigned to the Product Owner specified for this product in PICASso.

The records submitted to Jama can be manually updated in PICASso. You can update PICASso status, evidence link, justification, last test execution and verification status. Verification status can be updated only if Source Status is Approved. All these fields can be updated manually (three dots in Actions column – View/Edit – Edit), in bulk (by selecting the requirements and clicking ‘Edit’ in Bulk Actions section, or via file upload.

<img src="media/image215.png" style="width:7.9in;height:3.85in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image216.png" style="width:7.9in;height:3.80903in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Requirements submitted to Jama can be unlinked from Jama tickets via ‘Unlink’ button. To do so, use ‘Unlink’ option in Actions column (for each requirement) or in bulk by selecting the requirements and clicking ‘Unlink’ button in Bulk Actions section. <img src="media/image217.jpg" style="width:7.9in;height:2.41389in" alt="A screenshot of a computer AI-generated content may be incorrect." />

After confirmation, the requirement has been successfully unlinked from the Jama ticket and now requirement can be updated manually from PICASso.

<img src="media/image218.png" style="width:7.9in;height:3.52047in" alt="A screenshot of a computer AI-generated content may be incorrect." />

In case Jama object was unlinked by mistake, this action can be reverted by clicking "Relink" button for the requirement. Upon clicking – the requirement would be relinked to the previously linked Jama ticket: <img src="media/image219.jpg" style="width:7.9in;height:2.58269in" alt="A screenshot of a computer AI-generated content may be incorrect." />

The requirement has been successfully relinked:

<img src="media/image220.png" style="width:7.9in;height:3.32543in" alt="A screenshot of a computer AI-generated content may be incorrect." />

For all the requirements submitted Jama, data on the requirements preview pop-up would be updated and would show the following fields with respective data:

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 66%" />
</colgroup>
<thead>
<tr>
<th><strong>Field Name</strong></th>
<th><strong>Data Description</strong></th>
</tr>
</thead>
<tbody>
<tr>
<th>Requirement Name</th>
<td>Name of the Product Requirement in PICASso</td>
</tr>
<tr>
<th>Requirement Description</th>
<td>Description of the Product Requirement in PICASso</td>
</tr>
<tr>
<th>Rationale for Adding Requirements</th>
<td><p>Contains text specified as the rationale for adding requirements to release</p>
<p>Note: Shown only when requirement was added manually to release and not scopped automatically</p></td>
</tr>
<tr>
<th>Status</th>
<td><p>Requirement completion status from PICASso</p>
<p>Note: defined based on the Status Mapping configured on the Product Details</p></td>
</tr>
<tr>
<th>Backlog Link</th>
<td>Link to the linked Jama item</td>
</tr>
<tr>
<th>Last Test Execution</th>
<td>Link to the last test execution from Jama</td>
</tr>
<tr>
<th>Verification Status</th>
<td>Verification status of the last test execution from Jama</td>
</tr>
<tr>
<th>Updated by</th>
<td>User who has updated requirement last time in Jama</td>
</tr>
<tr>
<th>Updated on</th>
<td>Date when requirement was updated last time in Jama</td>
</tr>
</tbody>
</table>

<img src="media/image221.png" style="width:7.9in;height:3.25791in" />

##### Cybersecurity Residual Risks

To access residual risks data, navigate to the 'Cybersecurity Residual Risks' tab, which is next to the “Review&Confirm’ tab. By default, the SDL Process Summary page will be displayed. Use the left-hand side tabs to navigate and access information about the SDL Processes Summary, Product Requirement Summary, Threat Model, 3rd Party Suppliers&SE Bricks, among others. The Residual Risk value can also be viewed within the same section. Each section has instructions with the list of activities that should be performed in this section:

<img src="media/image222.png" style="width:7.9in;height:3.82014in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image223.png" style="width:6.46154in;height:2.59628in" alt="A screenshot of a computer Description automatically generated" />

###### SDL Processes Summary

In this section, we examine the remaining gaps in the process. During the planning of the development of this release, SDL Process Scoping activities identified a number of SDL Practice Requirements that were required to be completed during the development for this release.

SDL Processes Summary section reflects the SDL Details, Process Requirements List, Residual Risk evaluation, and Action items list.

<img src="media/image224.png" style="width:7.9in;height:3.825in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image225.png" style="width:6.69375in;height:0.80764in" />

Use the arrow keys to hide content whenever required.

To make any changes click on “Edit” button at the bottom right corner of the page and do not forget to save changes by pushing “Save” button. If changes are not saved, and you go to another section, a warning will appear with the options to save changes, go to another section without saving, or stay in this section. All data in the ‘Edit’ mode is saved automatically every 1 minute. But to be able to move to the next stage you should save all the changes manually.

In the ‘SDL Details’ sub-section there is ‘SBOM Status’ field, that was recently added. It is a dropdown list with three options: Submitted, In Progress and N/A. If ‘Submitted’ or ‘In Progress’ is selected, additional field ‘SBOM ID’ will appear. If ‘N/A’ is selected, you must provide justification. Additionally, there are several validations for these fields:

1.  At the ‘SA&PQL Sign Off’/Security and Privacy Readiness Sign Off stage: if the SBOM status is 'Submitted', the SBOM ID must be provided.

2.  At the ‘Final Acceptance’ stage: SBOM Status and SBOM ID cannot be empty; if SBOM status is ‘In Progress’, SBOM ID must be provided before release completion.

In this section you should also add SDL Artifacts Repository link and specify if there is any SDL gap found:

<img src="media/image226.png" style="width:7.9in;height:3.82222in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Evaluation statuses for the process requirements and risk classification will be provided by responsible individuals at the SA&PQL Sign Off stage. At ‘Manage’ stage you can use ‘ADD Action’ tab to list action items and save your entries.

<img src="media/image227.png" style="width:6.68958in;height:3.22708in" alt="A screenshot of a computer Description automatically generated" />

###### Product Requirements Summary

This section is designed and behave exactly the same way as “SDL Processes Summary”. What you need to do here is to provide Cybersecurity Roadmap link and add actions if needed.

<img src="media/image228.png" style="width:6.69375in;height:2.73046in" alt="A screenshot of a computer Description automatically generated" />

<img src="media/image229.png" style="width:7.9in;height:3.89375in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Here you can also see the percentage of applicable, expected and essential requirements that were implemented during the release:

Percentage of all applicable CS requirements that were implemented is count based on the formula: Count of all Product Requirements applicable for the Product with status “Fully met” across all releases divided by count of all Product Requirements applicable for the Product across release chain including postponed.

Formula for the percentage of all expected CS requirements implemented: Count of all Product Requirements applicable for the Product in the current release with status “Fully met” divided by count of all Product Requirements applicable for the Product in the current release.

Percentage of all essential CS requirements implemented is calculated based on the formula: all requirement with an evaluation status ‘Fully met’ divided into all requirements with ‘Source’ status is equal to ‘Essential’.

###### System Design

This section captures important design information for a system offer that will support the FCSR.

1\. Provide a link to system architecture document and/or to the diagram that shows the zones and conduits, and how they are secured.

2\. List all the components utilized in the system.

3\. List all the compensating countermeasures and the security risks they mitigate, with confirmation they are in-place in the system for the targeted security level.

4\. Add action plan proposals if required to address residual risk posed by the system design. This section appears only in case the “Product Definition” is equal to “System”.

<img src="media/image230.png" style="width:6.69375in;height:3.14514in" alt="A screenshot of a computer Description automatically generated" />

To input the System Design details, click the 'Edit' button located at the bottom right of the page.

<img src="media/image231.png" style="width:6.69375in;height:3.13194in" alt="A screenshot of a computer Description automatically generated" />

If in the ‘Reference to Schneider Electric’ section of the Release Details tab you have added Included SE Components with any product type except of SE Bricks/Library/Platform type, they will be added as components to the System Design section automatically.

To add new component, click on ‘Add component’ button and provide all the information as mentioned below. You can either select the product existing in PICASso or create new component:

<img src="media/image232.png" style="width:7.9in;height:3.79722in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image233.png" style="width:7.9in;height:3.84097in" alt="A screenshot of a computer AI-generated content may be incorrect." />

To add new countermeasure, click ‘Add Countermeasure’ button and provide all necessary information:

<img src="media/image234.png" style="width:7.9in;height:3.86181in" alt="A screenshot of a computer AI-generated content may be incorrect." />

You can add several countermeasures by clicking ‘Add Countermeasure’ button multiple times. It is also possible to remove added countermeasures by clicking ‘Bin’ icon:

<img src="media/image235.png" style="width:7.9in;height:3.84306in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Add actions if needed:

<img src="media/image236.png" style="width:7.9in;height:3.85069in" alt="A screenshot of a computer AI-generated content may be incorrect." />

###### Threat Model

Threats that have not been investigated or mitigated are a source of cybersecurity risks. The residual risk rating of the Threat Model is to be classified based upon the combination of the severity (CVSS) and status of threats which are still to be investigated or mitigated.

NOTE: Threat Models and results should be protected as company confidential.

1\. Complete the Threat Model information details (Link to Threat Model is mandatory field)

2\. Provide the number of threats in each of the Severity / Status categories

3\. Populate the table of mitigations still to be implemented

4\. Populate the table of Threats that have been 'Accepted'

5\. Classify the overall level of residual cybersecurity risk due to not investigated, unmitigated, or accepted threats

6\. Add action plan proposals if required to address gaps in the Threat Model

<img src="media/image237.png" style="width:7.9in;height:2.24097in" alt="A screenshot of a computer AI-generated content may be incorrect." />

By clicking on the “+Add Threat Mitigation” and “+Add Accepted Threats” new records in the tables are added.

###### 3<sup>rd</sup> Party Suppliers & SE Bricks

Cybersecurity vulnerabilities can enter products from development outside of Schneider. Schneider can inherit security risks from third-party products that it brand-labels, or when there is custom component developed for Schneider from a third-party supplier (TPS). Note that even when development is completed externally, Schneider and its project teams are responsible for managing what has contributed to the security of its products. In addition, vulnerabilities can arise due to the integration of SE Bricks / libraries which themselves contain vulnerabilities; or in the case of Bricks which are at 'end-of-support', the product development is responsible for the brick.

In this section you need to provide TPS Products and SE Bricks/Libraries/Platforms of this product.

To add a TPS Product, click on the corresponding button and provide all the details: Name, Type, TPS Name, IRA rating, etc.:

<img src="media/image238.png" style="width:7.9in;height:3.88889in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If any Bricks/Libraries/Platforms were added as included SE Components on the release details tab, it will be automatically added to the ‘SE Bricks/Libraries/Platforms’ chapter. To add new record, click on ‘Add SE Brick/Library/Platform’ button and fill out the details. Similarly to System Design section, you can either add a product that already exists in PICASso or add completely new record.

<img src="media/image239.png" style="width:7.9in;height:3.52569in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image240.png" style="width:7.9in;height:3.47083in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Once the product is added here, it will be reflected on the release details in the Included SE Components tab.

At any point of time, you can remove the record by clicking on the bin icon next to the TPS Product or SE Brick/Library/Platform record.

<img src="media/image241.png" style="width:7.9in;height:3.86597in" alt="A screenshot of a computer AI-generated content may be incorrect." />

###### Static Code Analysis

In this section you need to add SAST tools that are used. It can be Coverity, Fortify, Klockwork or any other tool:

<img src="media/image242.png" style="width:7.9in;height:3.86319in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Select a Static code analysis tool from the drop-down field and then click on “Add Tool” button appeared next to the drop-down.

If the tool used in the product SDL isn't listed, please select the 'Other' option and input the name of the tool in the field that appears. Afterward, click the '+Add Tool' button.

<img src="media/image243.png" style="width:6.68056in;height:3.11806in" alt="A screenshot of a computer Description automatically generated" />

Once you have added the tool, fill out all the details as mentioned below:

<img src="media/image244.png" style="width:7.9in;height:3.85694in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Add actions and save changes before moving to the next section.

###### Software Composition Analysis 

In this section you need to select Software Composition Analysis tool and list third party components with unmitigated vulnerabilities.

<img src="media/image245.png" style="width:7.9in;height:3.88819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Select a Software Composition Analysis tool from the drop-down field and then click on “Add Software” button appearing next to the drop-down.

<img src="media/image246.png" style="width:6.69375in;height:2.74583in" alt="A screenshot of a computer Description automatically generated" />

Once the tool is selected, provide the following details:

<img src="media/image247.png" style="width:7.9in;height:2.43958in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Then provide the details for third party components with unmitigated vulnerabilities. To add new record, click on ‘Add line’ button.

<img src="media/image248.png" style="width:6.69375in;height:2.97917in" alt="A screenshot of a computer Description automatically generated" />

Add actions if needed and save changes.

###### FOSS Check

In this section you need to provide free&open source software licensing details: provide answers to the questions and add comments if needed.

If answer to the first question ‘Does the product contain any FOSS?’ is ‘Yes, then you must provide Open Source& Licensing Offer Information link:

<img src="media/image249.png" style="width:7.9in;height:3.93056in" alt="A screenshot of a computer AI-generated content may be incorrect." />

###### Security Defects 

Verification and Validation (V&V) security testing by the project team can discover potential vulnerabilities. Every project is required to complete their own security testing before submission to a separate independent pen-test team with all test failures tracked via internal backlog or defect tracking tools. For Systems, countermeasure validation must be included in the V&V plan and confirmed they work as designed., any unmitigated risks or vulnerabilities discovered from the V&V testing for the countermeasures should be listed along with any unresolved security risks or outstanding vulnerabilities from third-party devices.

Pen testing by an independent team is part of the SDL process. The objective of this section is to identify remaining issues discovered by a Pen Test team. For systems, there should be a review of the system pen-test and any individual component pen-test results with applicable vulnerabilities being listed in the following tables.

In this section:

1\. List the remaining SVV Test issues still to be fixed / mitigated, and specify a target release when a fix / mitigation is to be implemented. Select the source of the issue (V&V Testing, Pen Testing, External) and severity. Add link to Jira case if needed.

2\. Complete the Pen Test details: pen test type, Internal SRD Number or Vendor reference number, who performed testing. Number of Critical/High/Medium/Low severity issues will calculated automatically, based on the answers provided in the SVV Test Issues section (with source - Pen Testing)

3\. Add action plan proposals if required to address SVV Test issues

Click on “+Add SVV Issue” button to add the record and provide SVV Issue title, source (whether it was found during V&V testing, pen testing or external testing), add link to backlog item, select severity and target release for the fix:

<img src="media/image250.png" style="width:7.9in;height:3.82222in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Once you list SVV test issues you can filter it by source or severity

<img src="media/image251.png" style="width:7.9in;height:2.74375in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Then provide penetration testing details. First of all, answer the question if pen test was performed as part of this release. Then, depending on the answer, provide a justification if the test wasn’t performed, delegated or it’s not applicable for the release, or provide pen details if it was performed:

<img src="media/image252.png" style="width:7.9in;height:3.86667in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image253.png" style="width:7.9in;height:3.83819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Please note that pen test type and internal SRD number are mandatory fields. Pen test date is mandatory if the pen test type is ‘Full’.

The number of remaining issues will be populated automatically from the SVV Test Issues section.

Additionally, there is a validation that Pen Test Details should be populated before FCSR Review.

Add actions if needed and save changes before moving to the next section.

###### External Vulnerabilities

External vulnerabilities are reported by individuals outside of Schneider (researchers, customers, etc.). External vulnerabilities are managed via a specific process and stored in a JIRA database. The status of these externally reported vulnerabilities must be considered during the FCSR.

1\. List remaining external vulnerabilities, their source, severity, and the target release for the fix / mitigation

2\. Add action plan proposals if required to address external vulnerabilities

Click on “+Add Issue” button to add the record and fill out the details: External Vulnerability Name, Source, Backlog link, severity and target release for fix. Similarly to Security Defects sections, once the issues are listed, you can filter them by source and severity.

<img src="media/image254.png" style="width:7.9in;height:3.82917in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### FCSR Recommendation

Once the release artifacts are collected, all process and product requirements are fulfilled, as well as action items and cybersecurity residual risk details, the product owner and/or security manager should provide their recommendation on release readiness to go live.

<img src="media/image255.png" style="width:6.89583in;height:3.40489in" alt="A screenshot of a computer Description automatically generated" />

To do so, navigate to the ‘FCSR Decision’ tab and click on the ‘Edit’ button at the bottom right corner.

Then click on “+Add Participant”. A pop-up will appear, where you can select participants from the release team, select a recommendation and provide comments:

<img src="media/image256.png" style="width:7.9in;height:3.81597in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If you want to add a recommendation on behalf of other team member, just click ‘Save&Create New’, and select other person to provide a recommendation. The recommendation should be chosen from the list: No-Go, Go with Pre-Conditions, Go with Post-Conditions, Go. FCSR participant should also type the comments in the box. In case “GO with Post-Condition” or “GO with Pre-Condition” recommendation is selected at least one action item of “Post-Condition” or “Pre-condition” category must be added.

To add the action, scroll down and select '+Add action'. Fill in the necessary details which include: the Action Name, the Action State (options include Open, In Progress, On-Hold, etc.) and the Category (which can be Pre-Condition, Post-Condition or Tracked). Set a due date for this action by selecting a date in the 'Due Date' field. Add a description in the provided 'Description' field and add any corresponding evidence. Choose an Assignee from the list. Once all the information is filled in, ensure you click 'Save' to keep your changes. There is also an option to delete the action after saving.

<img src="media/image257.png" style="width:7.9in;height:3.85347in" />

After the action is created, it is an option to submit it to Jira. To do this, select the action and click on the ‘Submit Actions to Jira’ button. The context window will appear, click ‘Submit’.

<img src="media/image258.png" style="width:6.69792in;height:1.85417in" alt="A white background with text Description automatically generated" />

If a recommendation isn’t provided, the system will show a warning and it isn’t possible to move to the next stage without a recommendation.

There is also a possibility to add a recommendation of FCSR participant, that do not belong to the release team or do not have access to PICASso (for example, architects, developers, pen testers, etc.). To do so, in ‘Add FCSR Participant pop-up, go to ‘Others’ tab:

<img src="media/image259.png" style="width:7.9in;height:3.91111in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Select user from the list (they should be registered in SailPoint), type the role, select a recommendation and provide comment (optional), the click ‘Save’.

Once recommendations are provided, they will appear in the list of FCSR Participants:

<img src="media/image260.png" style="width:7.9in;height:1.46528in" alt="A screenshot of a computer AI-generated content may be incorrect." />

To edit or delete a recommendation, click three dots in the Actions column:  
<img src="media/image261.png" style="width:7.9in;height:1.45903in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### Release **Submit for SA & PQL Sign Off**

When all tabs are completed, and the release is ready for review click on “Submit for SA & PQL” button.

<img src="media/image262.png" style="width:6.68958in;height:1.48472in" alt="A screenshot of a computer Description automatically generated" />

The message will appear at the top of the screen and the status of the release will be changed.

<img src="media/image263.png" style="width:6.68958in;height:1.4375in" alt="A screenshot of a computer Description automatically generated" />

#### SA & PQL Sign Off

Both Security Advisor (or responsible for FCSR readiness review according to the routing rules) and Process Quality Leader (PQL) will get their task in the “My Tasks” list.

All actions described in the Manage stage are available to them except Jira submission. Their responsibility is to review all the data provided by the team, correct if needed, evaluate process and product requirements completeness, classify residual risks in each section of Cybersecurity Residual Risks tab, and add actions if needed.

**Note!** In the requirements section, there are two columns: 'Status' and 'Evaluation Status'. The 'Status' column reflects statuses from Process and Product requirements tabs, while the 'Evaluation Status' column should be completed by Security Advisor and/or Process Quality Leader within SDL Processes Summary and Product Requirements Summary sections of the Cybersecurity Residual Risks tab.

In the '**SDL Processes Summary**' tab, there are two automatically calculated fields: 'Total number of Applicable SDL Practice Requirements for Release (excluding sub-requirements)' and 'Total number of Completed SDL Practice Requirements for Release (excluding sub-requirements)'.

<img src="media/image264.png" style="width:6.69722in;height:2.28098in" alt="A screenshot of a computer Description automatically generated" />

The '*Total number of Applicable SDL Practice Requirements for Release (excluding sub-requirements)*' is derived automatically from the 'Status' column in the 'Requirements' section using the following formula: Count of all Product Requirements for the Product in the current release with status “Done” divided by count of all Product Requirements for the Product in the current release.

Similarly, the field '*Total number of Completed SDL Practice Requirements for Release (excluding sub-requirements)*' uses the following calculation: Count of all Product Requirements applicable for the Product in the current release with status “Fully met” divided by count of all Product Requirements applicable for the Product in the current release.

SA and PQL should review all the requirements and accordingly, adjust the evaluation status. Available options for the 'Evaluation Status' field are: Not evaluated, Not met, Partially met and Fully met.

In the '**Product Requirement Summary**' tab there are two auto calculated fields: 'What percentage of all applicable CS requirements for the product have been implemented thus far?' and What percentage of all expected CS requirements for this release (as per roadmap) have been implemented?

<img src="media/image265.png" style="width:6.69792in;height:2.04167in" alt="A screenshot of a computer Description automatically generated" />

Count formula for the first field is: Count of all Product Requirements applicable for the Product with status “Fully met” **across all releases** divided by count of all Product Requirements applicable for the Product across release chain including postponed.

Count formula for the second field: Count of all Product Requirements applicable for the Product in **the current release** with status “Fully met” divided by count of all Product Requirements applicable for the Product in the current release.

Additionally, SA&PQl must review all the information provided on the CSRR tab, including Threat Model Details, Static Code Analysis, Software Composition Analysis, and so on.

Once the review is completed the SA and PQL will have to add their recommendations in FCSR Decision tab.

1)  Click on ‘Edit’;

2)  Click on ‘+Add Participant’;

3)  Enter the name and the recommendation, comments if needed.

Both Security Advisor and Process Quality Leader should provide their recommendations.

<img src="media/image266.png" style="width:6.69375in;height:2.63403in" alt="A screenshot of a computer Description automatically generated" />

If the product team should provide additional information or re-do something the user can send the release for rework by clicking on the button ‘Rework’ and provide a justification.

<img src="media/image267.png" style="width:6.68194in;height:1.02083in" alt="A screenshot of a computer Description automatically generated" />

If the data provided is sufficient the user will click on the ‘Submit for FCSR Review’.

Once both Security advisor and PQL submit for FCSR the release status is changed to “FCSR Review” and the release is moved to the next stage. The task for Security advisor and PQL will be closed and not available in the “My Tasks” list.

<img src="media/image268.png" style="width:6.69375in;height:1in" alt="A screenshot of a computer Description automatically generated" />

#### FCSR Decision

##### FCSR Details 

<img src="media/image269.png" style="width:6.69375in;height:2.95694in" alt="A screenshot of a computer Description automatically generated" />

The person responsible for the FCSR can enter the topics discussed during the offline meeting.

1.  Activate edit mode by clicking on “Edit”

2.  Click on “+Add Topic”

3.  Add the Topic Name, Discussion Details

<img src="media/image270.png" style="width:6.69375in;height:3.10625in" alt="A screenshot of a computer Description automatically generated" />

The FCSR participant can select from the dropdown field “FCSR Approval Decision”: No Go, Go with Pre-Conditions, Go with Post-Conditions, or Go.

If the FCSR Decision requires exception “Exception Required” toggle button should be on and the comments are mandatory for entry. Either CISO, SVP, or Both should be ticked in “Submit To” multiselect to nominate for exception review and approve.

<img src="media/image271.png" style="width:6.69792in;height:1.92708in" alt="A screenshot of a computer Description automatically generated" />

When FCSR Decision is selected the decision maker can either:

1)  “Approve FCSR”

2)  “Escalate” to the upper level (Security Advisor-\>LOB Security Leader -\> BU Security Officer)

3)  Return to the product team for “Rework”

<img src="media/image272.png" style="width:6.68194in;height:0.90625in" alt="A screenshot of a computer Description automatically generated" />

If the FCSR Approval Decision is 'Go with Post-Conditions', the system will not permit FCSR Approval until at least one action tagged with the 'Post-Condition' category is added to the release.

<img src="media/image273.png" style="width:6.69375in;height:2.91389in" alt="A screenshot of a computer Description automatically generated" />

If the FCSR Approval Decision is “Go with Pre-Conditions” the system will not allow to Approve FCSR until at least one Action with “Pre-Condition” category is added to the release.

If there are no actions with post- or pre-conditions provided, the system will warn about it:

<img src="media/image274.png" style="width:5.73194in;height:1.44792in" alt="A screenshot of a computer Description automatically generated" />

##### FCSR Escalation

When FCSR is escalated to the upper level the appropriate individual will get a task to review the FCSR for release and approve an FCSR Decision, change it, or escalate to the next level (refer to [FCSR Details](#fcsr-details) section).

The escalation hierarchy is as follows:

1)  Security Advisor-\> LOB Security Leader

2)  LOB Security Leader -\> BU Security Officer.

<img src="media/image275.png" style="width:6.69792in;height:1.01042in" alt="A screenshot of a computer Description automatically generated" />

##### FCSR Exception

The CISO and/or SVP LOB will get an email notification about the raised exception, and they can navigate to the screen with the FCSR exception review and approve from application. Or in the PICASso, they will get a task in “My Tasks”, click on it, and the system will redirect to the “FCSR Decision” tab to review the summary of the FCSR and comments regarding required exception.

CISO/SVP will either “Approve FCSR” or send it back to the team for a “Rework”.

If both CISO and SVP are requested to approve an exception, then when both approve the FCSR the release status will change to “Actions Closure” and the release will be moved to the next stage.

#### Post FCSR Actions

##### Option1: FCSR Decision “No Go”

If the FCSR Approval Decision is “No Go” the only available action button to the product team will be “Cancel” the release. Once the user clicks on the “Cancel” button, the status will be changed to “Canceled” and the release flow is ended.

<img src="media/image276.png" style="width:6.69375in;height:1.20833in" alt="A screenshot of a computer Description automatically generated" />

##### Option 2: FCSR Decision “Go” or “Go with Post-Conditions”

If the FCSR Decision was “Go” or “Go with Post-Conditions” the product team will get a task to complete the release.

<img src="media/image277.png" style="width:6.69722in;height:0.875in" alt="A white rectangular object with text Description automatically generated" />

<img src="media/image278.png" style="width:6.69792in;height:1.72917in" alt="A screenshot of a computer Description automatically generated" />

When the user hits “Submit” button the release status will be changed to “Completed” and the release flow is ended.

<img src="media/image279.png" style="width:6.69375in;height:1.09167in" alt="A screenshot of a computer Description automatically generated" />

##### Option 3: FCSR Decision “Go with Pre-conditions”

If the FCSR Approval Decision is “Go with Pre-Conditions” the release is moved to the Post FCSR Actions stage to work on the actions with “Pre-Condition” category to close them.

<img src="media/image280.png" style="width:3.02126in;height:1.60439in" alt="A screenshot of a computer Description automatically generated" />

The user will need either submit actions to Jira or update the status manually.

<img src="media/image281.png" style="width:5.86205in;height:2.53238in" alt="A screenshot of a computer Description automatically generated" />

#### Final Acceptance

The user responsible for the FCSR review will receive a task to review the Post FCSR Actions closure when the FCSR Decision was “Go with Pre-Conditions” and accept them by clicking on “Final Acceptance” or revert to the product team requesting additional information or changes/adjustments.

<img src="media/image282.png" style="width:6.68958in;height:0.97708in" alt="A green and white screen Description automatically generated" />

Once the responsible user selects the 'Final Acceptance' button, the release status updates to 'Completed':

<img src="media/image283.png" style="width:6.69792in;height:0.88542in" alt="A white rectangular object with blue text Description automatically generated" />

The work on the release is now completed.

If there is a need to cancel the release, Product Owner or Security Manager should provide a justification.  
<img src="media/image284.png" style="width:7.90068in;height:2.95859in" />

### 2.7 Email notifications

On each stage of the release management flow, an accountable individual will receive a task in the system and an email notification to complete this task.

#### 2.7.1. Release Creation Confirmation

**Trigger**: once a release for the product is created.

**Recipients:**

- TO: Product Owner, Security Manager

- CC: Security Advisor

**Email Subject:**  
Automatic Confirmation: Release \[RELEASE\] Creation and SDL Process Initiation for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We are pleased to inform you that the release \[RELEASE\] for the product \[PRODUCT\] has been successfully created in the PICASso system, and the SDL process has now been initiated.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.2. Release Scope Review

**Trigger:** Once the release is submitted for Scope Review and Confirmation

**Recipients:**

- TO: Security Advisor, LOB Security Leader\*, BU Security Officer\*

- CC: Product Owner, Security Manager

\* Here is a table outlining which business roles should receive notifications based on the Minimum Oversight Level and Risk Classification. These rules are applicable for FCSR Approval as well.

<img src="media/image285.png" style="width:7.90625in;height:2.30208in" />

**Email subject**:  
Automatic Request: Scope Review Requested: Release \[RELEASE\] for Product \[PRODUCT\]

**Email body**:

Dear \[RECIPIENT\],

We request you to conduct a review and confirm the scope of the release and the release risk classification for release \[RELEASE\] of the product \[PRODUCT\].

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.3. Release Scope Confirmation.

**Trigger:** Once the release scope is confirmed

**Recipients:**

- TO: Product Owner, Security Manager

- CC: Security Advisor, LOB Security Leader\*, BU Security Officer\*

**Email Subject**:

Automatic Confirmation: Scope of Release \[RELEASE\] for Product \[PRODUCT\] Confirmation

**Email Body**:

Dear \[RECIPIENT\],

We are pleased to inform you that the scope of release \[RELEASE\] for the product \[PRODUCT\] has been confirmed in the PICASso system. Request you to proceed to the next step of SDL process.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.4. Release Scope Re-work

**Trigger:** Once the release was returned to rework by SA/LOB SL/BU SO

**Recipients:**

- TO: Product Owner, Security Manager

**Email Subject**:

Automatic Action Required: Scope of Release \[RELEASE\] for Product \[PRODUCT\] Requires Changes

**Email Body**:

Dear \[RECIPIENT\],

We inform you that the scope of release \[RELEASE\] for the product \[PRODUCT\] has not been confirmed in the PICASso system. Please login to the system to check what changes are requested.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.5. Release Completion Reminder

**Trigger:** Once the release is in progress the tool will calculate the remaining time before Release Target Date. And if it exceeds XX% of the release timeline the tool generates an email remainder.

**Recipients:**

- TO: Product Owner, Security Manager

- CC: Security Advisor

**Email Subject**:

Automatic Reminder: Pending action items for Release \[RELEASE\] for Product \[PRODUCT\]

**Email Body**:

Dear \[RECIPIENT\],

A gentle reminder that currently your Release target date is approaching and you pending action items. Your release is scheduled for readiness on \[DATE\].

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.6. Release Readiness Review for FCSR

**Trigger:** Once the release is submitted for SA&PQL Sign Off

**Recipients:**

- CC: Product Owner, Security Manager

**Email Subject:**

Automatic Confirmation: Under Review for FCSR readiness for Release \[RELEASE\] for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We request you to kindly conduct a review ofthe Cybersecurity Residual Risks, implemented SDL Process and Product Requirements and sign off the release readiness for FCSR as a part of SDL process in PICASso.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.7. Release Readiness Confirmation

**Trigger:** Once the release is submitted by SA and PQL

**Recipients:**

- TO: Product Owner, Security Manager

**Email Subject:**

Automatic Confirmation: Release \[RELEASE\] of the Product \[PRODUCT\] is submitted for FCSR

**Email Body:**

Dear \[RECIPIENT\],

We are pleased to inform you that the FCSR readiness for Release \[RELEASE\] for Product \[PRODUCT\] is submitted in PICASso.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.8. Release Readiness Confirmation – ReWork

**Trigger:** If SA or PQL sends a release to rework

**Recipients:**

- TO: Product Owner, Security Manager

**Email Subject**:

Automatic Action Required: Release \[RELEASE\] of the Product \[PRODUCT\] has been returned for a re-work

**Email Body:**

Dear \[RECIPIENT\],

We inform you that the FCSR readiness for Release \[RELEASE\] for Product \[PRODUCT\] has not been signed in PICASso and returned for a re-work. Please login to the system to check what changes are requested.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.9. FCSR Review by SA/LOB Security Leader/BU Security Officer

**Trigger:** SA and PQL sign off the release and send it to FCSR Review.

**Recipients:**

- TO: Security Advisor/ LOB Security Leader/ BU Security Officer

- CC: Product Owner, Security Manager

**Email Subject:**

Automatic Action Required: Release \[RELEASE\] confirmed for FCSR review by SDL SA (LOB Security Leader/BU Security Officer) for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We request you kindly conduct a Formal Cybersecurity Review for Release \[RELEASE\] of the Product \[PRODUCT\] as per SDL requirements and proceed with the decision in PICASso.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.10. FCSR Exception

**Trigger:** Once FCSR Approver raises an exception for FCSR

**Recipients:**

- TO: CISO, SVP LOB

**Email Subject:**

Automatic Action Required: Exception Requested for Release \[RELEASE\] for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We would like to inform you that an exception is requested for Release \[RELEASE\] of the Product \[PRODUCT\] in PICASso. Kindly review the request and make a decsion.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.11. FCSR Completion

**Trigger:** Once the release FCSR decision is submitted

**Recipients:**

- TO: Product Owner, Security Manager

- CC: Security Advisor

**Email Subject:**

Automatic Notification: Decision available for Release \[RELEASE\] of Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We would like to inform you that the decision for Release \[RELEASE\] of the Product \[PRODUCT\] is avaialble in PICASso. Request you to proceed to the next step of SDL process.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.12. Final Approval

**Trigger:** When an FCSR is completed and there were action items with status ‘Pre-Condition’ in the release.

**Recipients:**

- TO: Security Advisor, LOB Security Leader\*, BU Security Officer\*

**Email Subject:**

Automatic Action Required: Review the Release \[RELEASE\] for Product \[PRODUCT\] for final Approval

**Email Body**:

Dear \[RECIPIENT\],

We request you to kindly review the completion of pre-condition action items for the Release \[RELEASE\] of Product \[PRODUCT\] in PICASso and provide a decision.

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.13. Release Completion - Completed

**Trigger:** Once the release is completed.

**Recipients:**

- TO: Product Owner, Security Manager, Security Advisor, LOB Security Leader, BU SO, CISO

**Email Subject:**

Automatic Notification: Release \[RELEASE\] for Product \[PRODUCT\] is Completed

**Email Body:**

Dear \[RECIPIENT\],

We are please to inform you that the Release \[RELEASE\] of the Product \[PRODUCT\] is Completed in PICASso. For more information please check the application (link?).

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.14. Release Completion - Cancelled

**Trigger:** the release was cancelled due to some reasons

**Recipients:**

- TO: Product Owner, Security Manager, Security Advisor, LOB Security Leader, BU SO

**Email Subject:**

Automatic Notification: Release \[RELEASE\] for Product \[PRODUCT\] is Cancelled

**Email Body:**

Dear \[RECIPIENT\],

We regret to inform you that the Release \[RELEASE\] of the Product \[PRODUCT\] is Cancelled in PICASso. For more information please check the application \[LINK\].

If you have any further questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.15. Role Delegated to User

**Trigger:** role has been delegated to user

**Recipient:** Delegate User

**Email Subject:** Automatic Notification: Role Delegation: \<role\>

**Email Body:**

Dear \<delegate user\>,

We would like to inform you that \<role\> role was delegated to you by \<delegator\>.

Delegation Details:

Start Date: \<Start Date UTC\>

Expiration Date: \<Expiration Date UTC\>

Justification:  \<justification\>

Delegator's open tasks were assigned to you in PICASso, check the 'My Tasks' tab.

Please contact \<delegator\> if you have questions about the delegation. If you have any other questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.16. Role Delegation Has Expired/Has Been Removed

**Trigger:** Role Delegation has been ended (expired or removed manually)

**Recipient:** Delegate User

**Email Subject:** Automatic Notification: \[ROLE\] Role Delegation Expiration/Removal

**Email Body:**

Dear \[RECIPIENT\],

We regret to inform that the \[ROLE\] role delegation has expired/has been removed on \[DATETIME\].

Related open tasks were reassigned to the delegator.

Please contact \[USER THAT DELEGATED THE ROLE\] if you have questions about the delegation.

If you have any other questions or require additional support, please don't hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.17. Notification for Actions Assignment

**Trigger:** Action has been created and assigned to user/Action that didn’t have assignee has been assigned to user

**Recipients:**

- TO: Action Assignee

- CC: Product Owner, Security Manager, Security Advisor

**Email Subject:** PICASso: Actions for \[PRODUCT\] recently assigned to you

**Email Body:**

Hello \[ACTION_ASSIGNEE\],

The following actions for the \[PRODUCT\] in PICASso were assigned to you yesterday, please check them below:

\[ACTIONS_ASSIGNED_YESTERDAY\]

The complete list of actions created for this product can be found on the \[ACTIONS_PAGE\] page.

Please reach out to PICASso Support team if you have any questions.

Best regards,

PICASso Team.

### 2.8. Release History

All actions performed in the release are logged in the Release History. Click on the ‘View Release History’ to open a pop-up.

<img src="media/image286.png" style="width:6.9056in;height:3.34817in" />

Once clicked, you will see a table with a list of activities, their description and users who performed these activities:

<img src="media/image287.png" style="width:7.90625in;height:3.86458in" />You can search for specific user or description, filter by activities and select a date range. Click ’Search’ to apply filters.

<img src="media/image288.png" style="width:7.90625in;height:3.86458in" />

### 2.9. Stage Responsibles Side Bar

This functionality is designed to ensure users can efficiently manage and review each stage of the release process.

Each stage in the release flow is clickable and opens a side bar on the right side of the screen.

A ‘Need Help’ button is located in the upper-right corner of the screen. Clicking this button also opens the same side bar, offering quick access to all relevant stage information.

<img src="media/image289.png" style="width:7.9in;height:3.81944in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image290.png" style="width:7.9in;height:2.52778in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Side Bar Overview**

1\. Header: Complete Release Stage

The header displays the name of the stage the release is currently in.

<img src="media/image291.png" style="width:7.9in;height:3.70139in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Stage Responsibles Section**

This section provides granular details about the individuals responsible for the current stage and the actions required to proceed.

<img src="media/image292.png" style="width:7.9in;height:3.81528in" alt="A screenshot of a computer AI-generated content may be incorrect." />

This section includes:

- Number of Submissions: Indicates how many submissions are needed to move the release to the next stage.

- Dynamic List of Responsible Individuals: A table displaying the users responsible for completing this stage. The table contains the following three columns:

1\. User: Name of the responsible user.

2\. Role: The assigned role of the user (e.g., Security Advisor, Privacy Reviewer).

3\. Approval Date: Date when the user approved the stage. If the user hasn't approved yet, this field will remain empty.

\- In addition, a green checkmark will appear to the left of a user's name once the individual has approved the stage.

**Stage Description Section**

A brief description of the stage is presented:

<img src="media/image293.png" style="width:7.9in;height:3.82292in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Justification for Rework**

If a release is returned to rework at any stage, the justification comment will be displayed here. The justification appears in the stage that the release transitions to for rework. <u>Example:</u> *If the Security Advisor sends the release back to the Manage stage due to incomplete information during the SA&PQL Sign Off stage, the justification will appear on the Manage stage of the side bar.*

<img src="media/image294.png" style="width:7.9in;height:3.85069in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Navigation Buttons**

At the bottom of the side bar, two navigation buttons are available:

1\. Previous Stage: Displays the information for the preceding stage.

2\. Next Stage: Displays the information for the subsequent stage.

These buttons allow users to easily navigate between stages without having to close and reenter the side bar.

A close button (cross icon) is also available to exit the side bar and return to the main release flow screen.

<img src="media/image295.png" style="width:4.08369in;height:7.56732in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Additional Details**

1\. Approval by Unauthorized Users.

If a release stage is approved by a user who is not officially assigned to that stage, the user's name will still appear in the Stage Responsibles section of the side bar.

Example: If the BU Security Officer approves the ‘Review and Confirm’ stage instead of the Security Advisor, the name of the BU Security Officer will be logged in this section.

2\. Dynamic Assignment of Responsible Users

If the questionnaire has not yet been submitted (at the ‘Creation & Scoping Stage’), the individuals responsible for the subsequent stages will be determined based on the Minimum Oversight Level (MOL) of the product :

When MOL is set to "Team", the individual responsible for the ‘Review & Confirm’, ‘FCSR Review’, and ‘Final Acceptance’ stages will be the Security Advisor.

For an MOL of "LOB SL", the responsible individual will reflect that specific user.

**Dynamic List Updates**

The list of responsible users is dynamic, meaning it will automatically adjust based on changes to:

1\. Risk Classification

2\. Data Privacy Review Applicability:

- If a Data Privacy review is needed for the release (triggered by specific conditions) the following adjustments will be made:

At the ‘Review and Confirm’ stage, a Privacy Advisor will be added to the list.

At the ‘Security and Privacy Readiness Sign Off’ stage, a Privacy Reviewer will be included as a responsible individual.

### 2.10 Maintenance and Informative/Warning Banner

#### 2.10.1. Maintenance Banner

During the deployment of new features and enhancements by the Picasso team, the system will be temporarily unavailable. End-users will see a notification banner indicating this downtime. Once the deployment is complete, the system will be accessible again. A confirmation will be shared via Viva Engage.

<img src="media/image296.png" style="width:7.9in;height:3.80833in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### 2.10.2. Informative/Warning Banners

**Informative Banner**

- Purpose: To display important non-critical messages for user awareness (e.g., announcements, tips, system updates).

- Appearance: Light blue color.

- Behavior: Stays visible throughout the system until the user manually closes it.

**Warning Banner**

- Purpose: To display critical or cautionary messages (e.g., warnings about upcoming downtime, potential issues, or urgent notices).

- Appearance: Light orange color.

- Behavior: Stays visible throughout the system until the user manually closes it.

<img src="media/image297.png" style="width:7.9in;height:1.54444in" alt="A screenshot of a computer AI-generated content may be incorrect." />

### 2.11. Actions Management

The Actions Summary pop-up has been enhanced with several new features and updates to improve the user experience. First of all, the ‘Actions Summary’ was renamed to ‘Actions Management’ and is opened in the separate browser window.

Secondly, now it possible to access the page not only from the release, but from the product as well.

<img src="media/image298.png" style="width:7.90625in;height:3.58333in" /><img src="media/image299.png" style="width:7.90625in;height:3.875in" />

The Actions Management page has the following view:

<img src="media/image300.png" style="width:7.90625in;height:3.82292in" />

A page displays all the actions created for the product across different releases.

- **Closed actions** are hidden by default but can be included using the toggle ‘Include Closed’ switch.

**Columns and Sorting Options**

- **Action Name** – displays the name of the action, is clickable and leads to this action in the release.

- **Due Date** – shows the deadline for action completion

- **Status** – represents the status of the action: Open, In Progress, On Hold, Closed.

- **Jira Link** – if the action was sent to Jira, this column contains a link to the corresponding Jira ticket.

- **Release Number -** indicates the release in which the action was initially created.

- **Assignee** - displays the user name whom the action was assigned.

- **Category** – represents the category of the action: Pre-Condition, Post-Condition, Tracked.

- **Origin** – shows where the action was created. For example, SDL Processes Summary, FCSR Decision Tab, Review and Confirm tab, etc.

- The list is **sorted by the "Due Date" column** by default in ascending order.

**Filters**

- **Search** field: allows to search by the action name

- **Status**: dropdown list, allows to show actions with selected status

- **Release Number:** dropdown list, allows to filter by the specific release

- **Assignee** – lookup field to filter by the user to whom the action is assigned

- **Category** – dropdown list to show the actions with specific category only

- **Due Date Range** - date picker. Allows to select the dates when the action was created.

- **Reset Button** – clears all filters

#### 2.11.1. How to Use the Actions Management Page

**1. Viewing Actions**

- By default, the page loads with all actions from different releases displayed.

- Closed actions are hidden but can be displayed by toggling the switch.

<img src="media/image301.png" style="width:7.90625in;height:3.78125in" />

**2. View Action Details Within the Same Page**

To see the details of the action, click on three dots icon and click ‘Edit’ (for the products managed in Jira). If the product is not managed in Jira, click on pencil icon:

<img src="media/image302.png" style="width:7.90625in;height:3.625in" />A pop-up will appear with the action details:

<img src="media/image303.png" style="width:7.90625in;height:3.8125in" />Click ’Edit’ again to make changes:

<img src="media/image304.png" style="width:7.90625in;height:3.73958in" />

To send action to Jira, click on ‘Three dots’ and ‘Submit to Jira’:

<img src="media/image305.png" style="width:7.90625in;height:2.59375in" />Click ’Submit’ again in the opened pop-up window:

<img src="media/image306.png" style="width:7.90625in;height:3.82292in" />Once the action is submitted to Jira, you will see a link in the ’Jira Link’ column:

<img src="media/image307.png" style="width:7.90625in;height:2.375in" />Data from Jira is automatically refreshed once per day, but if you want to receive the most recent information, click on the ’Refresh Jira Data’ button at the upper right corner of the screen:

<img src="media/image308.png" style="width:7.90625in;height:2.3125in" />

#### 2.11.2. How to create an action from Actions Management page

1\. Click on ‘Create Action’ button.

<img src="media/image309.png" style="width:7.9in;height:3.7875in" alt="A screenshot of a computer AI-generated content may be incorrect." />

2\. A pop-up will be opened where you need to specify action’s details:

<img src="media/image310.png" style="width:7.9in;height:3.65in" alt="A screenshot of a computer AI-generated content may be incorrect." />

\- Name: specify the name of the action. Mandatory field.

\- Status: by default ‘Open’ status is selected, but you can select another status from the dropdown list.

\- Evidence link – mandatory if the status is ‘Closed’

\- Category – this field is hidden, by default the category for actions created on Action Management page have ‘Tracked’ category.

\- Due date – date picker. Here you can select target date for the action’s completion. Non-mandatory. Past dates can’t be selected. Can be edited in following cases:  
1) when action is available for editing in the linked release (stage where the action is created is the same as the current stage of this release)

\- Assignee – here you can select the person responsible for the action’s completion.

\- Closure comment – this field appears when the action status is ‘Closed’. Mandatory field.

\- Description – here you can specify what should be done in more details.

When you specify all the details, click to ‘Create’ to save the action.

<img src="media/image311.png" style="width:7.9in;height:3.78542in" alt="A screenshot of a computer AI-generated content may be incorrect." />Once created, the action will appear in the list of actions on the Actions Management page. The origin of this action will be ‘Actions Management’ and it won’t be displayed anywhere in the release.

<img src="media/image312.png" style="width:7.9in;height:3.82153in" alt="A screenshot of a computer AI-generated content may be incorrect." />

You can edit action’s details by clicking ‘Pencil’ icon. First you will see a pop-up with details and then click ‘Edit’ to adjust.

<img src="media/image313.png" style="width:7.9in;height:3.82014in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If action was created on another stage of the release comparing to where release currently is - only fields "Status", "Closure Comment", "Evidence" and "Assignee" are available for editing. Other fields are shown in the disabled state.

<img src="media/image314.png" style="width:7.9in;height:3.70278in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### 2.11.3. Actions Management History

To see the history of changes on the Actions Management page click on the ‘View History’ link:

<img src="media/image315.png" style="width:7.9in;height:3.78194in" />

Once clicked, a pop-up will be opened, where you will see all the records related to the changes in actions:

<img src="media/image316.png" style="width:7.9in;height:6.70347in" alt="A screenshot of a computer AI-generated content may be incorrect." />

You will see who and when made changes, the activity type, action name, description, assignee of the action, release where the action was created (if it was created from the Actions Management page, you will see ‘No release’ in this column) and the origin – either corresponding tab/section in the release or ‘Actions Management’ if it was created from this page.

There are several filters, you can:

- Search by the action’s description

- Filter by activity: Actions Update or Jira Submission

- Select a date range of the history

- Filter by assignee

- Filter by release number

- Filter by the origin of the action

You can also reset the filters by clicking ‘Reset’ button.

The activities (either on the Actions Management page or in the release) that are logged in the history include:

- Action’s creation.

- Action details update.

- Action status update – as a separate record.

- Jira submission.

- Manual refresh data from Jira – from Actions Management page only.

#### 2.11.4. Actions status bar chart on Actions Management page

On the Actions Management page you can see the bar chart with information on the count of all actions available for the product in each possible status.

- Total number of actions available for the product on the left

- List of available actions statuses along with the number of actions for each status on the right

- The horizontal bar chart with the number of actions for each status

The bar chart is displayed when at least one action is added to the Actions Management page.

<img src="media/image317.png" style="width:7.9in;height:3.83958in" />

#### 2.11.5. Actions Summary section on the Review&Confirm tab

The "Actions Summary" section provides users with a quick overview of actions associated with the product during the Review and Confirm stage.

The "Actions Summary" section is designed to provide a snapshot of actionable data for each product in a visually engaging and accessible way. By default:

- Collapsed View: When the "Review and Confirm" tab is opened, the "Actions Summary" section is hidden (collapsed).

- To view details, the user must click on the Actions Summary label, which expands the section to display actionable insights via a bar chart and filters.

Note: If the product does not have any actions associated with it, the "Actions Summary" section will not be displayed on the "Review and Confirm" tab.

When the Actions Summary section is expanded, a **bar chart** displays the count of all actions available for the product, grouped by their status. Below are the details provided by the chart:

<img src="media/image318.png" style="width:7.9in;height:3.81389in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Bar Chart Breakdown**

- **Chart Representation**:

  - Actions are segmented by their **status** (Open, In Progress, On Hold, and Closed).

  - Each segment is color-coded based on the action's status:

    - **Open**: Blue

    - **In Progress**: Yellow

    - **On Hold**: Grey

    - **Closed**: Green

  - The percentage of actions from the total number is displayed alongside the color-coded legend.

**Legend Details**

- **Total Actions**: The total number of actions is displayed on the left side of the chart.

- **Action Statuses**: A color-coded legend on the right helps users identify the count of each type of action.

**Filters in the Actions Summary Section**

To fine-tune the bar chart data, the Actions Summary section includes the following filters:

- Status Filter: A dropdown menu allows users to select a specific status of actions to focus on. Note: When "Closed" is selected, the "Include Closed" toggle will automatically activate unless it is already active.

- Due Date Range: a calendar widget enables users to select a date range for filtering actions. Default Date Range: when the page opens, the period is preselected with the range: "01 Jun 2024 - \<Target release date for the current release\>".

- Include Closed: a toggle that allows users to view closed actions alongside open actions. Default State: Unchecked when the page is opened. When enabled, closed actions will be included in the bar chart data.

<img src="media/image319.png" style="width:7.9in;height:1.56458in" alt="A blue and grey bar AI-generated content may be incorrect." />

**Actions Summary Data Behavior and Snapshot Updates**

The data displayed in the Actions Summary section is a **snapshot** reflecting the current state as the product moves through release stages. Below is how data behavior is governed based on user actions:

- When the release moves from the **Review and Confirm stage** to the **Manage stage** (through the "Submit and Review" button), the chart data is **frozen** to reflect the current state at the moment of transition.

- Once frozen, the data will not update, regardless of future changes to actions.

- If the release reverts to the **Creation and Scoping stage** from the **Review and Confirm stage**, the chart data will reflect the updated state of actions based on the "current moment."

2.11.6. Email Notifications for Actions

PICASso automatically notifies users when actions are assigned to them. This notification is sent via email every day at 9:00 AM CET and summarizes all actions assigned to each user during the previous day. This chapter explains how the notification system works, how emails are grouped and triggered, and how to configure the email content.

**1. How Daily Assignment Notifications Work**

When an action is assigned to a user - either at the time of creation or when the assignee is updated - the system sends a daily summary email. This email includes all actions assigned to the user within the previous day (from 00:00 to 23:59 CET), grouped by product.

**Email Trigger and Grouping**

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 17%" />
<col style="width: 25%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Email Trigger</strong></th>
<th style="text-align: center;"><strong>Case</strong></th>
<th style="text-align: center;"><strong>Grouping Condition</strong></th>
<th style="text-align: center;"><strong>Recipients</strong></th>
</tr>
</thead>
<tbody>
<tr>
<th><blockquote>
<p>Action assigned to a person</p>
</blockquote></th>
<td><blockquote>
<p>Action is created and assigned to a person</p>
</blockquote></td>
<td><blockquote>
<p>1 email per product, listing all actions (except those with status "Closed") assigned to this user and created yesterday</p>
</blockquote></td>
<td><blockquote>
<p>Assignee, Product Owner, Security Manager, Security Advisor (Product Owner, SM, SA in CC)</p>
</blockquote></td>
</tr>
<tr>
<th>Action assigned to a person</th>
<td>Action is assigned (not submitted to Jira)</td>
<td>1 email per product, listing all actions (except those with status "Closed") assigned to this user and updated yesterday</td>
<td>Assignee, Product Owner, Security Manager, Security Advisor (Product Owner, SM, SA in CC)</td>
</tr>
</tbody>
</table>

**Note:** Only actions not in the "Closed" status are included in the notification.

**2. Default Email Template**

Below is the default template used for daily assignment notifications:

**Subject:**  
PICASso: Actions for \[PRODUCT\] recently assigned to you

**Body:**  
Hello \[ACTION_ASSIGNEE\],

The following actions for the \[PRODUCT\] in PICASso were assigned to you yesterday. Please check them below:

\[ACTIONS_ASSIGNED_YESTERDAY\]

The complete list of actions created for this product can be found on the \[ACTIONS_PAGE\] page.

Please reach out to the PICASso Support team if you have any questions.

Best regards,  
PICASso Team<span id="Bookmark21" class="anchor"></span>

### 2.12. Tooltips Across the PICASso

This chapter outlines the tooltips added to guide the user what should be done within each stage within release management workflow as well as tooltip on the product details page.

**1. Creation & Scoping Stage**

The goal of this stage is to ensure all initial requirements and information for the release are accurately scoped and reviewed.

*Release Details:*

Review the provided release details.

Update any missing or incorrect information.

*Roles & Responsibilities:*

Review roles for the SDL and Product Team.

Verify that all roles are correctly assigned.

*Questionnaire:*

Confirm that all questions have been answered in the release questionnaire.

Ensure the questionnaire is submitted.

*Process Requirements:*

Review the scoped process requirements for the release.

Ensure all statuses, evidence links, and justifications are up-to-date.

*Product Requirements:*

Review the scoped product requirements for the release.

Confirm that all statuses, evidence links, and justifications are updated.

**2. Review & Confirm Stage**

This stage focuses on verifying and confirming all scoped requirements, risks, and scope review decision for the release.

*Process Requirements:*

Review and confirm the process requirements identified for the release.

Ensure statuses, evidence links, and justifications are complete and accurate.

*Product Requirements:*

Review and update scoped product requirements.

Confirm all necessary links, statuses, and justifications are provided.

*Privacy Risk (if Data Protection and Privacy Review is applicable for the release:*

Validate the privacy risk assessment for the release.

*Risk Classification:*

Evaluate the risk classification and update it if necessary.

*Review & Confirm Tab:*

Review a summary of requirements and the previous FCSR (Full Cybersecurity Release) Summary.

Add scope review participants, highlight key decisions, list actionable items, and record the scope review decision.

**3. Manage Stage**

During this stage, detailed management of requirements, privacy reviews, evidence collection, and residual risks is performed.

*Process & Product Requirements:*

Ensure all statuses, evidence links, and justifications are up-to-date.

*Data Privacy Review (if applicable):*

Answer questions in the privacy review tab regarding evidence collection for each privacy section.

*Questions Tab (in the Privacy Sections):*

Provide answers to privacy questions and submit the questionnaire.

*Evidence Collection Tab (in the Privacy Sections):*

Verify existing evidence items.

Add new evidence items if needed.

*Cybersecurity Residual Risks Tab:*

Review all residual risk sections.

Ensure the necessary information is provided and accurate.

*FCSR Decision:*

Provide the FCSR recommendation by completing the FCSR Participants section.

**4. SA&PQL Sign-Off Stage**

In the sign-off stage, evaluations of process and product requirements completness, privacy review, cybersecurity risks, and residual risks are completed. Actions are added where necessary.

*Data Privacy Review Tab (this tab is filled out by Privacy Reviewer):*

Review privacy sections thoroughly.

Provide ratings for questions, evidence, feedback, maturity levels, and residual risks.

*Cybersecurity Residual Risks Tab (SA and/or PQL):*

Evaluate process/product requirements and residual risks.

Add necessary actions based on residual risks outcomes.

*FCSR Decision Tab:*

Add FCSR recommendations in the FCSR Participants section.

**5. FCSR Review Stage**

The FCSR review process validates the overall decision for cybersecurity and privacy evaluation and identifies actions required.

*FCSR Decision Tab:*

Add key discussion topics.

Provide FCSR decisions based on outcomes.

Document actionable items.

**6. Actions Closure Stage**

In the final closure stage, all outstanding action items from prior stages are addressed and documented.

*FCSR Decision:*

Ensure closure of all open action items.

**Tooltip for Requirement Status**

This tooltip helps clarify the status of requirements in different stages of the process. These tooltips are added to the "Status" column in the following locations:

Process Requirements Tabs

Product Requirements Tabs

Cybersecurity Residual Risks Tabs (SDL Process Summary Section & Product Requirements Summary Section)

*Tooltip Definitions:*

<u>Planned:</u> The requirement is planned for this release.

<u>In Progress:</u> The requirement is being worked on during the current release.

<u>Done:</u> The requirement is completed in the current release.

<u>Partial:</u> The requirement is partially covered in this release.

<u>Delegated:</u> The requirement was assigned to another team or partially completed and transferred to another team.

<u>Not Applicable:</u> The requirement is irrelevant for this release.

<u>Postponed:</u> The requirement is postponed for future releases.

**Tooltip for Product Type (Product Details page)**

A "Learn More" link can be found next to the "Product Type" title on the Product Details Page. When clicked, a pop-up will appear. It explains the different product types:

Brick / Library / Platform: Software meant to be embedded in another component. It does not operate independently.

Embedded Device: Single-use items tied to hardware and performing limited tasks.

Host Device: Devices operating on a general-purpose OS capable of running general-purpose workloads.

Hosted Application: Applications running on servers or cloud platforms, requiring security against platform-level threats.

Mobile Application: Apps designed for mobile devices (e.g., iOS, Android).

Native Software Application: Software operating on general-purpose OS (e.g., Windows, MacOS, Linux) requiring protection against external applications.

Network Device: Devices dedicated to managing network traffic, sensitive to manipulation and other threats.

System: Comprehensive systems composed of multiple components with unique lifecycles.

Web Application: Components handling HTTP traffic, susceptible to specific attacks (e.g., injection, XSS).

**Tooltip for Data Protection and Privacy Toggle Button**

When the toggle is disabled, you will see the next tooltip:

*This toggle activates Data Protection and Privacy Review tasks in the release*

When the toggle is enabled:

*An active release exists for this product. Data Protection and Privacy Review can be activated/deactivated only after the release is completed or cancelled*

### 2.13. Workflow Delegation

The Role Delegation feature offers users the possibility to assign roles to designated individuals. With this feature, users can delegate responsibilities

**Key Benefits:**

1.  Simplifies role delegation and improves task distribution.

2.  Enforces governance rules to maintain operational integrity.

3.  Enhances visibility into delegation details for better accountability.

4.  Supports bulk delegation to reduce administrative overhead.

#### 2.13.1. Accessing the Role Delegation Page

**Steps:**

1.  Navigate to the landing page of the platform.

2.  Find the "Roles Delegation" button.

    - Note: This button is only visible to authorized users. If you’re unable to locate it, please check your permissions with an administrator.

3.  Click the "Roles Delegation" button.

    - A new browser tab will open the "Roles Delegation" page.

<img src="media/image320.png" style="width:6.5in;height:3.18472in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### 2.13.2. Roles Delegation Page Layout

The Roles Delegation page is divided into two tabs: My Roles and Org Level Users.

My Roles tab represents a list of roles that a logged user has. It has a tabular layout that provides an overview of roles and their delegation statuses. Each row represents a unique role, with the following key columns:

1.  **Role Name:** Displays the name of the role (e.g., Product Owner, Security Manager).

2.  **Scope:** Indicates the scope level and its corresponding name (e.g., Org Level 1 - Industrial Automation).

3.  **Delegated Person:** The name of the individual to whom the role has been delegated. This field remains blank if no delegation has been assigned.

4.  **Start Date:** The date when the delegation begins.

5.  **Expiration Date:** The date when the delegation ends.

6.  **Actions:**

    - If no delegation exists, a **"Delegate"** button appears. Clicking this button triggers a popup for assigning the role.

    - If a delegation exists, three dots appear, offering the following options:

      - **Edit Delegation:** Opens a pop-up to modify delegation details.

      - **Remove Delegation:** Ends the delegation and resets the role assignment.

<img src="media/image321.png" style="width:7.9in;height:3.84236in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Org Level Users tab displays a list of users that belong to the scope of logged in user.

For example,

If logged user has Global role then they will see users with Org Level 1 2 3 and Product scope

If the logged user has Org Level 1 (BU Security Officer) role then they will see users with Org Level 2, 3 and product scope under their BU (e.g. Industrial Automation)

If the logged user has Org Level 2 role (LOB Security Leader) then they will see users with Org Level 3 and product scope

If the logged user has Org Level 3 role (LOB Security Leader Org 3) then they will see users with Product scope.

If logged user has Product role (e.g. Product Owner) then they will see users within their product (Security Manager, PQL, Security and Protection Advisor, Dedicated Privacy Advisor).

Org Level Users tab includes User Name, Email, LEAP License (active/inactive) and View details button. You can search user by the name using ‘Search’ field.

<img src="media/image322.png" style="width:7.9in;height:3.85069in" alt="A screenshot of a computer AI-generated content may be incorrect." />

To open the list of roles for specific user, click on ‘View Details’ button:

<img src="media/image323.png" style="width:7.9in;height:3.85in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Once clicked, you will see the roles and will be able to delegate it. The page looks almost the same as on ‘My Roles’ tab:

<img src="media/image324.png" style="width:7.9in;height:3.85in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Here you can either delegate the role/remove role delegation manually by clicking on ‘Delegate’/’Remove Delegation buttons in each row, or in bulk by checking checkboxes and use Bulk Actions section in the header:

<img src="media/image325.png" style="width:7.9in;height:3.88819in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### 2.13.3. Assigning a Role (Delegation Flow)

**Steps to Delegate a Role:**

1.  Identify the role you want to assign in the table.

2.  Click the **"Delegate"** button in the "Actions" column.

<img src="media/image326.png" style="width:7.9in;height:3.83056in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- A pop-up window will appear.

<img src="media/image327.png" style="width:7.9in;height:3.86042in" alt="A screenshot of a computer AI-generated content may be incorrect." />

3.  Fill in the following fields within the popup:

    - **Assignee:** Use the look-up field to select the individual.

      - *Note: This field is mandatory and must validate the user in the system.*

    - **Start Date:** Select a date using the date picker.

      - *Note: You cannot select a past date. Do not forget to specify the time.*

    - **Expiration Date:** Select an expiration date using the date picker.

      - *Note: The expiration date must be after the start date.*

      - A governance message will appear for delegation periods longer than 3 months:  
        *"Please note, that delegation period is monitored by the Governance team."*

    - **Justification:** Provide a rationale for the delegation in the free-text field.

      - *Note: This field is mandatory.*

4.  Click the **"Delegate"** button. A confirmation prompt will appear:  
    *"\<Role\> role will be delegated to \<Assignee\>. Do you wish to proceed?"*

<img src="media/image328.png" style="width:7.9in;height:3.82431in" />

5.  If confirmed, the system will:

    - Save the delegation.

    - Update the table with the delegated user's details, start date, and expiration date.

6.  Receive a success message:  
    *"Role delegation saved successfully."*

<img src="media/image329.png" style="width:7.9in;height:3.89236in" />

#### 2.13.4. Editing or Removing a Role Delegation

**Edit Delegation:**

1.  Click the three dots in the "Actions" column for a delegated role.

2.  Select **"Edit Delegation."**

<img src="media/image330.png" style="width:7.9in;height:3.78958in" />

3.  Update any required fields in the popup (e.g., assignee, start date, expiration date, or justification).

<img src="media/image331.png" style="width:7.9in;height:3.76389in" />

4.  Save the changes.

    - The table will update with the revised delegation details.

**Remove Delegation:**

1.  Click the three dots in the "Actions" column for a delegated role.

2.  Select **"Remove Delegation."**

<img src="media/image332.png" style="width:7.9in;height:3.83125in" />

3.  Confirm the action in the popup.

<img src="media/image333.png" style="width:7.9in;height:3.83611in" />

- The system will clear the assignee, start date, and expiration date fields, and replace the three dots with a "Delegate" button.

<img src="media/image334.png" style="width:7.9in;height:3.82917in" />

#### 2.13.5. Performing Bulk Role Delegation

**Steps:**

1.  Use the checkboxes in the table to select multiple roles for delegation or removal.

    - *Select All:* Use the top checkbox to select all visible roles in the table.

2.  Navigate to the "Bulk Actions" section (above the table).

    - *Note: Buttons will only be activated based on the status of the selected roles (unassigned, assigned, or mixed).*

3.  Choose an action:

    - **Delegate:** Opens a pop-up to assign delegates for all selected roles.

    - **Remove Delegation:** Triggers a confirmation popup to end delegation for all assigned roles.

<img src="media/image335.png" style="width:7.9in;height:3.82361in" />

**Bulk Delegation Workflow:**

1.  In the pop-up, provide/edit the following details for selected roles:

    - Delegatee (via look-up field).

    - Start Date (cannot be in the past).

    - Expiration Date (with governance warnings if \>3 months).

    - Justification.

2.  Save the changes.

<img src="media/image336.png" style="width:7.9in;height:3.84792in" />

**Bulk Removal Workflow:**

1.  Confirm the action in the pop-up.

    - *Note: Only roles with delegatees will be affected.*

2.  The system will:

    - Remove delegatees.

    - Clear associated delegation details.

<img src="media/image337.png" style="width:7.9in;height:3.83333in" />

#### 2.13.6. Viewing Delegated Roles on Product/Release Pages

**Product Details Page:**

1.  Delegated roles are displayed in the **Product Team** section.

    - The delegatee's name appears below the delegator's name.

2.  Delegated roles are displayed on the Roles&Responsibilities tab in the release.

<img src="media/image338.png" style="width:6.5in;height:3.1625in" alt="A screenshot of a computer AI-generated content may be incorrect." />

3.  Hover over a delegatee's name to view the tooltip justification.

    - *Example: "Delegated person with justification: The role was delegated due to ‘Workload prioritization during a critical project.’"*

<img src="media/image339.png" style="width:6.5in;height:3.15139in" alt="A screenshot of a computer AI-generated content may be incorrect." />

#### 2.13.7. Role Delegation Privileges and Expiration Behavior

1.  **Delegator Privileges Post-Delegation:**

    - Even after delegating a role, the original delegator retains their permissions within their scope of responsibility.

2.  **Post-Expiration Behavior:**

    - Once the expiration date passes:

      - The delegatee's access is automatically revoked.

      - The role in the table resets (clearing delegation details and restoring the "Delegate" button).

**8. Success Notifications**

Throughout the Role Delegation process, the system will display clear success messages after every action, such as:

- *"Role delegation saved successfully."*

- *"Delegation successfully ended for \<X\> roles."*

- *"Delegation details successfully updated for \<X\> roles."*

These messages ensure user confidence and transparency regarding delegation activities.

#### 2.13.8. Roles Delegation History

The *Roles Delegation History* feature provides users with permission to view and edit the Roles Delegation page a detailed log of delegation activities. This log includes comprehensive records of all delegation-related operations, complete with filtering, sorting, and pagination functionality. This chapter outlines how to access and use the Roles Delegation History to view, filter, and analyze delegation data efficiently.

To view the history, follow these steps:

1.  Open Roles Delegation page.

2.  Find ‘Delegation History’ button:

<img src="media/image340.png" style="width:7.9in;height:3.78264in" alt="A screenshot of a computer AI-generated content may be incorrect." />

3.  Click on the button to open a pop-up window titled Roles Delegation History.

4.  The Roles Delegation History pop-up provides a detailed table tracking various delegation activities. Below are the features and capabilities of this view.

Table Columns

- Date - displays the exact timestamp in the format: dd mmm yyyy, hh:mm (e.g., 15 Mar 2023, 10:45). Sortable: Clicking the column header toggles sorting between ascending and descending order. Default sorting order is descending.

- User - displays the name of the user who performed the delegation activity. Includes the user's profile image or a default placeholder if no image is available.

- Role Holder - displays the name of the user whose role was affected, especially in cases where delegation was done by other authorized users (i.e., not the currently logged-in user). Includes the user's profile image or a default placeholder if no image is available. This column appears only for users authorized to delegate roles to others.

- Activity - describes the type of delegation activity. Possible actions include: Role Delegation Assignment, Removal, Update, Expiration

- Description - provides detailed explanations of the action taken, including assigned, removed, updated, or expired roles, as well as changes to delegatee names, justifications, and dates.

Examples of descriptions:

Role Delegation Assignment: Product Owner role has been delegated to John Smith.

- Origin - displays the source tab from the Roles Delegation page where an activity originated: My Roles/Org Level Users

When the role was delegated by someone other than the currently logged-in user, the Origin column will remain empty.

<img src="media/image341.png" style="width:7.9in;height:3.82569in" />

Filtering Roles Delegation History

A filter panel is available at the top of the Roles Delegation History pop-up, allowing users to refine and search through the delegation records. You can search record by user, description; filter by activity and date range.

<img src="media/image342.png" style="width:7.9in;height:6.68958in" alt="A screenshot of a computer AI-generated content may be incorrect." />

If no records match the selected filters, a message will display: "No results found."

All active search terms and filters will remain visible for quick adjustment.

#### 2.13.9. Tasks Assignment

When a role is delegated, all tasks in the **"Open"** status from the delegator's *My Tasks* tab will be made available to the delegatee. Both the delegator and the delegatee will have access to the *Open* tasks.

If a task is completed and marked as **Closed** by either the delegator or the delegate, the task will automatically update its status to *Closed* for both users.

When the delegation expires or is removed:

- All *Open* tasks that had been transferred to the delegatee will be automatically removed from their *My Tasks* tab.

- These tasks will be reassigned back to the original delegator. This ensures that the ownership of unfinished tasks reverts to the original assignee after the delegation period ends.

#### 2.13.10 Email Notifications for Role Delegation

When the delegation was made or removed/expired, the delegate user will receive email about it. Once the delegation is made all the emails within release management workflow will be sent to the delegate user. Upon role delegation removal all future emails will be sent to the initial user.

### 2.14. Product/Release Inactivation

The ability to inactivate Products and Releases is restricted to users with specific privileges, ensuring controlled access. Only Product Admins have a permission to inactivate products and releases. Roles such as "Product Owner" and "Security Manager" do not have permissions to inactivate Products or Releases.

Before attempting to inactivate a Product or Release, ensure that the following conditions are met:

A Product can be inactivated if:

- It has no Releases/DOCs associated with it.

- It has only Cancelled Releases/DOCs.

A Release can be inactivated if:

- It is in the **Creation & Scoping** stage.

**Inactivate Product Button**

- **My Products Tab:**

  - An additional “Actions” column displays three dots (**...**).

  - Clicking this icon reveals options, including the "Inactivate" button.

<img src="media/image343.png" style="width:7.9in;height:3.73403in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- **Product Details Page:**

  - Three dots next to the Product status in the header reveal the "Inactivate" option.

<img src="media/image344.png" style="width:7.9in;height:3.80764in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- **Disabled Condition:**

  - If the Product does not meet inactivation conditions, the button will appear greyed out with a tooltip:

<img src="media/image345.png" style="width:7.9in;height:3.84722in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Inactivate Release Button**

**My Releases Tab:**

- The “Actions” column contains three dots (**...**). Clicking this icon reveals options, including "Inactivate."

<img src="media/image346.png" style="width:7.9in;height:3.72639in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Releases Tab in Products:**

- In the “Actions” column of this tab, three dots (**...**) reveal both "Inactivate" and "Clone" options.

<img src="media/image347.png" style="width:7.9in;height:3.77569in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Disabled/Unavailable Buttons:**

- For **active Releases** beyond the "Creation & Scoping" stage: The button is greyed out with a tooltip: **"Release cannot be inactivated as it passed 'Creation & Scoping' stage. If this release is no longer valid, it can be cancelled."**

<img src="media/image348.png" style="width:7.9in;height:3.72153in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- For **Completed Releases:**

  - The "Inactivate" button is not displayed (only "Clone" is available).

- For **Cancelled Releases:**

  - If **No-Go FCSR Decision** caused the automatic cancellation, the "Inactivate" button is not displayed.

  - If manually cancelled, the button is visible. Once inactivated, it will be possible to create a new release with the same name.

**Confirming Inactivation**

Clicking "Inactivate" for a Product or Release triggers a confirmation modal to ensure intentional action:

<img src="media/image349.png" style="width:7.9in;height:4.77778in" alt="A screenshot of a computer AI-generated content may be incorrect." />

**Post-Inactivation Behavior**

Once the product is inactivated, the status of the Product is updated to **Inactive** (on both the "My Products" tab and the Product Details page).

<img src="media/image350.png" style="width:7.9in;height:3.42153in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image351.png" style="width:7.9in;height:3.68472in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Interface changes:

A toggle replaces the previous "Show Inactive Products" button with "Show Active Only."

- **Enabled by default:** Displays only active Products.

- **Disabled:** Displays both active and inactive Products.

> <img src="media/image352.png" style="width:7.9in;height:3.86181in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Hovering over the status displays the justification entered during inactivation:

<img src="media/image353.png" style="width:7.9in;height:3.76667in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Inactive Products are no longer editable, and new Releases/DOCs cannot be created for them.

**Releases**

The status of the Release is updated to **Inactive** and are displayed on "My Releases" tab, "Releases" tab of the Product, and on the Release Details page.

<img src="media/image354.png" style="width:7.9in;height:3.85556in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- Interface changes:

The "Show Completed Releases" toggle is replaced with "Show Active Only":

- **Enabled by default:** Displays only ongoing Releases.

- **Disabled:** Displays Releases with statuses "Completed," "Cancelled," and "Inactive."

<img src="media/image355.png" style="width:7.9in;height:3.86806in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Hovering over the status displays the justification entered during inactivation:

<img src="media/image356.png" style="width:7.9in;height:3.69861in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Product and Release Inactivation is logged in the Product and Release History accordingly. It is logged under Product/Release Inactivation activity:

<img src="media/image357.png" style="width:7.9in;height:2.52153in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image358.png" style="width:7.9in;height:2.74306in" alt="A screenshot of a computer AI-generated content may be incorrect." />

### 2.15. Scope Approval/FCSR/Actions Management Report Generation

For various business needs, you may need to share the results of the FCSR (Full Cybersecurity Review) and scope approval processes in the form of reports. These reports can serve multiple purposes, such as:

- Providing evidence for certifications (full report)

- Communicating outcomes to your team (focused on decisions and action items)

- Sharing relevant information with other projects that use your solution as a component

The reporting feature ensures that information is tailored and appropriately presented to meet the needs of different stakeholders.

**How to Generate a Report**

1.  **Locate the 'Generate Report' Button**

    - Go to the **Releases** tab for your product or access specific release

<img src="media/image359.png" style="width:6.5in;height:3.13472in" />

<img src="media/image360.png" style="width:6.5in;height:3.19167in" alt="A screenshot of a computer AI-generated content may be incorrect." />

- The **Generate Report** button is visible only when the release is in the 'Manage' stage or later.

2.  **Open the Report Configurator**

    - Click the **Generate Report** button.

    - A pop-up window will appear, allowing you to select which sections to include in your report.

<img src="media/image361.png" style="width:6.5in;height:3.16944in" alt="A screenshot of a computer AI-generated content may be incorrect." />

3.  **Select Report Sections**

    - You can choose from the following main sections and their subsections:

      - **Scope Review & Approval**

        - Scope Approval Overview (always included if this section is selected)

        - Key Discussion Topics

        - Requirements Summary

        - Previous FCSR Summary (if at least one FCSR was completed)

        - Action Plan for Scope Review Decisions

      - **FCSR Results** (enabled if FCSR was performed for the release)

        - FCSR Overview (always included if this section is selected)

        - Action Plan for FCSR Decisions

        - Key Discussion Topics

        - PCC Decision (if DPP is applicable and risk is High/Critical)

        - SDL Processes Summary

        - Product Requirements Summary

        - System Design (if Product Type = System)

        - Threat Model

        - Third-Party Suppliers & SE Bricks

        - Static Code Analysis

        - Software Composition Analysis

        - FOSS Check

        - Security Defects

        - External Vulnerabilities

      - **Actions Management**

**Note:** If an FCSR decision has not been made yet, the FCSR section cannot be selected.

<img src="media/image362.png" style="width:6.5in;height:3.20069in" />

4.  **Generate or Cancel**

    - Once you have selected at least one section, you will see two options:

      - **Generate Report in PDF**: Downloads the report as a PDF file labeled 'Confidential'.

      - **Cancel**: Closes the menu without saving changes.

**Report Content and Structure**

Each report contains only the sections and subsections you selected. All links in the report are clickable for easy navigation.

**Metadata (Always Included)**

- Product Name

- Release Number (version)

- Generate Date (DD MM YYYY)

- Generated By (user name)

- Workflow with stages, responsible individuals, and completion dates

**Section 1: Scope Review & Approval**

- **Scope Approval Overview** (mandatory if section selected): Participants, decision, approver(s), approval date

- **Key Discussion Topics**: Topic, details, date, added by

- **Requirements Summary**: Pie charts for process and product requirements (status: Planned, In Progress, Done, etc.)

- **Previous FCSR Summary**: Findings from the latest FCSR (if available) – FCSR Decision, FCSR Aprrover, Approval Date, etc.

- **Action Plan for Scope Review Decisions**: Table of actions (name, state, category, due date, assignee, etc.)

**Section 2: FCSR Results**

- **FCSR Overview** (mandatory if section selected): FCSR Participants, FCSR Decision, Approver, FCSR Date, Risk classification, etc.

- **Key Discussion Topics**

- **Action Plan for FCSR Decisions**

- **SDL Processes Summary**: SBOM status, gaps, artifacts, requirements completion percentages

- **Product Requirements Summary**: Roadmap link, completion percentages, residual risk

- **Threat Model**: Repository link, last updated, threats, residual risk

- **System Design**: Architecture links, components, countermeasures, residual risk

- **Third-Party Suppliers & SE Bricks**: Components, suppliers, maturity, residual risk

- **Static Code Analysis**: Tools, issues, severity, residual risk

- **Software Composition Analysis**: Tools, findings, vulnerabilities, residual risk

- **FOSS Check**: FOSS usage and compliance

- **Security Defects**: Issues, pen test details, residual risk

- **External Vulnerabilities**: Name, source, severity, residual risk

**Section 3: Actions Management**

- Progress bar for action statuses

- Table of active actions (name, due date, status, release number, assignee, category, origin)

Generation of the report is logged in the release history under ‘Report Generation’ activity and specifying who and when has done this action.

### 2.16 PICASso Release History and Notes

This chapter explains how to access the PICASso Updates and Privacy Notice from the application header, and how to navigate the updates pop-up to stay informed about recent releases and content changes.

1.  A question-mark icon is located in the header of every page. This icon replaces the previous eye icon. To open the menu go to the top-right corner of the page and select the question-mark (?) icon. A small menu will appear with the following options: PICASso Updates and Privacy Notice:

<img src="media/image363.png" style="width:7.9in;height:3.83056in" alt="A screenshot of a computer AI-generated content may be incorrect." />

Clicking on ‘PICASso Updates’ opens a pop-up where the information about release can be reviewed:

<img src="media/image364.png" style="width:7.9in;height:3.89653in" alt="A screenshot of a computer AI-generated content may be incorrect." />

There are two types of updates – releases and content. You can filter the records to see only one type of updates, or both.

<img src="media/image365.png" style="width:7.9in;height:3.82222in" alt="A screenshot of a computer AI-generated content may be incorrect." />

It is also possible to search by key words in the description and collapse the records if needed.  
<img src="media/image366.png" style="width:7.9in;height:3.90833in" alt="A screenshot of a computer AI-generated content may be incorrect." />

<img src="media/image367.png" style="width:7.9in;height:3.88611in" alt="A screenshot of a computer AI-generated content may be incorrect." />
