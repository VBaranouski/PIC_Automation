**PICASso (Product Internal Controls Assurance Security) Tool**

**SUMMARY**

One-stop shop that assists teams to fulfil the needs of SDL and functional requirements\' elicitation (easyRQ), integration, and workflows to make the experience more efficient and more effective and Manage risks by Improving governance, evidence, auditing, traceability and metric collection at the same time.

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

    12. [Tooltips Across the PICASso System](#tooltips-across-the-picasso)

    13. [Workflow Delegation](#workflow-delegation)

## INTRODUCTION

The purpose of this document is to establish the Roles and Responsibilities of each user, how a user can request access and navigate the tool.

### 1.1 Purpose of PICASso

The primary objective of the new solution, Product Internal Control Assurance Security (PICASso), is to facilitate the comprehensive integration of cybersecurity practices and security and privacy requirements into the product development lifecycle. Its role extends to mandating their execution and offering cybersecurity and privacy governance and oversight across all business units, lines of business, and product teams.

For the purposes of this document, "product" refers to any development being performed for use inside or outside the company. For example, a product may be something developed for sale to an external customer, or by an internal customer such as Human Resources. Likewise, the term "customer" refers to the entity for which the work is being performed, either internal or external.

### 1.2 Scope

The PICASso functional requirements include the following items:

Use cases for:

-   Product creation and update,

-   Release creation and update,

-   SDL Process Requirements Management

-   Product Requirements Management

-   Data Protection and Privacy Review

-   System Design Details

-   Threat Model Details

-   3rd-Party Suppliers & SE Bricks Details

-   Static Code Analysis Details

-   3rd-Party & OSS Vulnerabilities Details

-   FOSS Check Details

-   V&V Testing Details

-   Pen Test Details

-   Ext. Vulnerabilities Details

-   Action Management

-   Formal Cybersecurity Review (FCSR, including exceptional approval flow, release closure)

-   Reporting and Dashboard

-   JIRA Integration

-   User Authentication, User Authorization (Roles & Permissions, RBAC)

-   Technical requirements

## USER NAVIGATION

### 2.1. Authentication & Authorization

1.  If the user without access to the LEAP platform attempts to open PICASso application, they will be redirected to the page where they can request a license.

![A screenshot of a computer Description automatically generated](media/image1.png){width="6.692913385826771in" height="2.1254286964129485in"}

> When the license is assigned to the user they will be redirected to a screen as below:

![A screenshot of a computer error Description automatically generated](media/image2.png){width="6.692913385826771in" height="3.8168832020997376in"}

> Clicking on the link above (in blue), user will be directed to ServiceNow page with the PICASso Request form already opened:

![A screenshot of a computer Description automatically generated](media/image3.png){width="6.692913385826771in" height="5.718862642169729in"}

> Using the process below, the user will raise a ticket in ServiceNow to request access to the tool.

1.  When the page is accessed, information in the fields \"Requested by\", \"Email ID\" are auto populated. Please verify.

2.  If you are raising the request on behalf of another user, please identify the name from the drop down in the field "Requested for" and verify the information from field "Email ID"

3.  Select option \"Access request\" for the field "What is your request related to?", when you are raising a request to access PICASso.

4.  Select the Select BU / Org 1 the user is from using the drop-down options in this field.

5.  Depending on the availability provide 'LOB / Org 2 and Entity / Org 3.'

6.  Enter the Product / Project information for which you are raising the access request.

7.  Depending on the availability, provide STAC information.

8.  Select the requested role of the user from the drop down.

9.  Provide a brief business justification.

10. Provide any supporting documents using the 'add attachments' option.

11. Click Submit to create the request successfully.

> When all the required information is entered, the page may look like the below image:
>
> ![A screenshot of a computer Description automatically generated](media/image4.png){width="6.692913385826771in" height="7.147425634295713in"}
>
> Post submission a ticket is created with ID 'REQxxxx' and the page may look like on the image below:
>
> ![A screenshot of a computer Description automatically generated](media/image5.png){width="6.692913385826771in" height="2.5913429571303586in"}
>
> Points to note:

a.  Depending on the role requested, the user may be asked to study the training documents that are required to be completed as a part of access permission requirements.

b.  Depending on the situation, a user may be required to hold more than one role. in such scenarios raise separate tickets for each role.

<!-- -->

2.  If the user has access to and assigned role in PICASso they will be prompted to enter Ping SSO details when they attempt to open PICASso application.

![A screenshot of a login page Description automatically generated](media/image6.png){width="3.937007874015748in" height="1.900906605424322in"}

### Landing Page Overview

When the user logs in to PICASso, the system brings them to the Homepage, where they can see four tabs on the main screen form "My Tasks", "My Products", "My Releases", "Reports & Dashboards".

![A screenshot of a computer AI-generated content may be incorrect.](media/image7.png){width="7.9in" height="3.825in"}

#### My Tasks

"My Tasks" tab shows all the open tasks assigned to the user or available to the user with a SuperUser role. The user can filter the list of tasks by the following data:

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Search                       Drop down field, listing names of the tasks
  ---------------------------- -------------------------------------------------------------------------------------------------------------------------------------------
  Release:                     Drop down field, listing names of the releases opened for the user in the system

  Product:                     Dropdown field listing all products associated with the presented task

  Task Creation Date Range:    Range of dates

  Show Closed Tasks            Toggle button

  Assignee                     Look up field. By default, current user is selected. But if the user has access to other users' tasks they can select them from the list.
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The "Reset" button clears up all filters' settings.

To open the task the user either click on the "Name" of the task or "Review" button in the row.

![A screenshot of a computer AI-generated content may be incorrect.](media/image8.png){width="7.9in" height="3.5597222222222222in"}

#### My Products

![A screenshot of a computer AI-generated content may be incorrect.](media/image9.png){width="7.9in" height="3.582638888888889in"}

"My Products" tab shows all the products registered in the system and visible/opened for the user. The user can filter the list of products by:

  ----------------------------------------------------------------------------------------------------------------
  Search                        Drop down field, listing names of the products
  ----------------------------- ----------------------------------------------------------------------------------
  Org Level 1                   Dropdown field with the list of Org Level 1 (BU Level) organizations

  Org Level 2                   Dropdown field with the list of Org Level 2 (Department/LOB level) organizations

  Product Owner                 Dropdown field with the list of Product Owners names.

  Show Active Only              Toggle button, enabled by default
  ----------------------------------------------------------------------------------------------------------------

The "Reset" button clears up all filters' settings.

To open the product the user clicks on the name of the product in the "Product" column and to open the latest release for this product - on the release version under the "Latest Release" column.

![A screenshot of a computer AI-generated content may be incorrect.](media/image10.png){width="7.9in" height="3.872916666666667in"}

#### My Releases

![A screenshot of a computer AI-generated content may be incorrect.](media/image11.png){width="7.9in" height="3.8354166666666667in"}

"My Releases" tab shows by default all releases in progress linked to the products the user has access to. The user can filter the list of releases by:

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Search                       Drop down field, listing a concatenation of Product Name and Release
  ---------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------
  Product                      Dropdown field listing all products associated with the presented releases

  Target Release Date          Range of dates

  Status                       Drop down field listing release statuses

  Show Active Only             Toggle button, enabled by default. When enabled, only ongoing releases are displayed. Once disabled, Cancelled, Completed and Inactive releases are shown
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The "Reset" button clears up all filters' settings.

To open the release the user clicks on the release version under the "Release" column and to open the linked JIRA project -- on the "Link to the Source project" under the "JIRA" column.

![A screenshot of a computer AI-generated content may be incorrect.](media/image12.png){width="7.9in" height="3.879166666666667in"}

#### Reports & Dashboards

"Reports & Dashboards" tab presents the metrics for each product the user has access to based on his role and level of visibility (Org Level 1 or BU Level, Org Level 2 or Department/LOB level, Org Level 3 or LOB/Entity level, Product).

##### **2.2.4.1. New and Updated Columns**

The following enhancements have been made to the columns and data displayed on the **My Reports** page:

Columns/Data

The following information is now available and visible as columns:

1.  **Product** - displays the product name and links to the product\'s details pages.

2.  **Release**

    a.  Shows the most recent release created for the product in PICASso (based on the release creation date).

    b.  The release number is clickable, allowing users to open the related release details.

3.  **Release Status**

    a.  Displays the status of the release.

4.  **Responsible Users**

Separate columns for the following roles, reflecting the users responsible for the product or release:

a.  Product Owner

b.  Security Manager

c.  Security Advisor

d.  Privacy Advisor

e.  PQL

f.  SVP LoB

g.  LOB Security Leader

<!-- -->

5.  **Data Privacy Risk Level - d**isplays the calculated Privacy Risk level for the release.

6.  **Cybersecurity Risk Level** - displays the calculated Cybersecurity Risk level for the release.

7.  **Last BU Level FCSR Date** - shows the date of the FCSR review completed for the product (conducted by the BU officer).

> **Notes**:

1.  Displays \"Unknown\" if the date is not available.

2.  The value is highlighted if the date is \"Unknown\" or older than 12 months from today\'s date.

<!-- -->

8.  **Last Full Pen Test Date**

    a.  Displays the date of the most recent Pen Test conducted for the product.

**Notes**:

1.  Displays \"Unknown\" if unavailable.

2.  The value is highlighted if the date is \"Unknown\" or older than 12 months.

<!-- -->

9.  **Last Completed Release**

    a.  Displays the data from the most recent release with a status of \"Completed\" for the product.

    b.  The release number is clickable.

10. **Last Completed Release FCSR Decision - d**isplays the FCSR Decision from the last completed release.

11. **Last Completed Release FCSR Exception Required**

    a.  Displays \"Yes\" or \"No\" based on whether an FCSR Exception was required for the most recent release.

**Note:** The value is highlighted if it is \"Yes.\"

12. **Number of Open Actions/Conditions**

    a.  Shows the count of all open actions (SDL/FCSR and Privacy) that are not in \"Closed\" status.

**Note**: The number is clickable, linking users to the **Actions Summary** of the last release.

![](media/image13.png){width="7.90625in" height="3.8854166666666665in"}

##### **2.2.4.2. Updated and New Filters**

The following filters have been introduced/improved to enable granular control over the reports:

-   **General Filters**

1.  Org Level 1 -- filter by Business Unit

2.  Org Level 2 -- filter by Line of Business

3.  Org Level 3 -- filter by Entity

4.  Product -- filter by product

5.  Release Number

    a.  Displays all releases for the selected products.

**Note**: These filters are interdependent. For example:

1)  *If Org Level 1 is set to \"Industrial Automation\", only related child organizations will appear in Org Level 2.*

2)  *If a product is selected, only releases linked to the product will appear in the Release Number filter.*

-   **User Role Filters**

Separate filters are available for the following roles associated with a product or release:

-   Product Owner

-   Security Manager

-   Security Advisor

-   Privacy Advisor

-   PQL

-   SVP LoB

-   LOB Security Leader

**Notes**:

-   Multiple values can be selected at once (e.g., filtering by multiple Product Owners).

-   All products/releases linked to the selected roles will be displayed.

**Additional Filters**

1.  Product Creation Period - filter based on the date or date range when the product was created.

2.  Release Creation Period - filter based on the date or date range when the release was created.

3.  Product Type

    a.  Filter products by their type.

    b.  Multiple values can be selected for this filter.

![](media/image14.png){width="7.90625in" height="2.2708333333333335in"}

##### **2.4.2.3. Filter Data by a Specific Release (Non-Current)**

When filtering by a specific release that is not the current one, the following information will be displayed in the report columns:

-   Product Name

-   Release Number

-   Release Status

-   Responsible User Roles (Product Owner, Security Manager, Security Advisor, Privacy Advisor, Privacy Reviewer, PQL, SVP LOB, LOB Security Leader)

-   Data Privacy Risk Level

-   Cybersecurity Risk Level

-   **FCSR Decision** and **FCSR Exception Required Flag** from the specified release

**Note**: Columns like **Last BU Level FCSR Date**, **Last Full Pen Test Date**, **Last Completed Release**, and **Number of Open Actions/Conditions** will not display any data for non-current releases.

##### **4. Configuring Column Display**

Users can personalize the columns displayed on the **My Reports** page:

1.  **Configure Columns**:

    a.  Click on the \"Configure Columns\" button.

    b.  Use the drop-down list to select or deselect columns.

    c.  Click \"Done\" to save changes.

**Notes**:

-   Changes apply only to the individual user\'s view and do not affect other users.

-   Users can save their selection, so the configuration is loaded by default when they revisit the page.

2.  **Additional Options**:

    a.  **Cancel**: Discard changes by clicking the Cancel button.

    b.  **Restore Default**: Revert to the default column settings.

> Default columns: Product Name, Release, Release Status, Data Privacy Risk Level, Cybersecurity Risk Level, Last BU Level FCSR Date, Last Full Pen Test Date, Last Completed Release, FCSR Decision, and Number of Actions.
>
> ![](media/image15.png){width="3.200277777777778in" height="3.575310586176728in"}

Clicking on the "Access Tableau" will redirect the user to the reports in Tableau, to which the same access rules are applied as in PICASso UI.

Access to Tableau should be requested via ticket in ServiceNow, that can be submitted here - [Service Catalog - support@Schneider](https://schneider.service-now.com/supportatschneider?id=sc_cat_item&sys_id=0f0a231a93118650a067bd158aba10d1)

### New Product Creation

The new release can be created only for the product existing in PICASso. So, the first step- is to create a new product in PICASso. Only authorized users can create a new product in the tool (Product Admin Org 1, Product Admin Org 2, Product Admin Org 3). To create a new product please follow the next steps:

1.  On Home page click on the "New Product" button in the upper right corner of the screen.

![A screenshot of a computer Description automatically generated](media/image16.png){width="6.69375in" height="2.35625in"}

2.  The Product creation screen form will be displayed.

Note: Only "Product Details" tab will be available for data entering. "Releases" is greyed out because releases can be added only to already created product.

![A screenshot of a computer AI-generated content may be incorrect.](media/image17.png){width="7.9in" height="3.8534722222222224in"}

3.  Enter the data as follows:

+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Name                                                                                  | Free text field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+:==============================================================================================+===========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================+
| Product State                                                                                 | Dropdown field with possible options of the product's state in the product lifecycle (Under Development, Continuous Development, etc.). The field is mandatory.                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Definition                                                                            | Classification of the product as per IEC62443 standard: Component as Whole or System. Select 'None' if IEC62443 is not applicable for your product. Dropdown filed, mandatory. This field can be updated after product creation, but it should be done if the release is on 'Creation&Scoping' stage as updating will impact product requirements scoping. If product definition has been changed, questionnaire must be re-submitted. If the release is on the stage where the questionnaire can't be re-submitted, then the changes will be applied to future releases. |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Type                                                                                  | Type of product, e.g. Hosted Device, Mobile Application, etc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | Dropdown field, is mandatory,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | This field can be updated after product creation, but it should be done if the release is on 'Creation&Scoping' stage as updating will impact product requirements scoping. If product type has been changed, questionnaire must be re-submitted. If the release is on the stage where the questionnaire can't be re-submitted, then the changes will be applied to future releases.                                                                                                                                                                                      |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Data Protection&Privacy                                                                       | Toggle button. Enables Data Protection and Privacy Review for the product.\                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|                                                                                               | How to disable it: If the product has an active release, it is not possible to disable the DPP toggle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | On the Creation & Scoping stage DPP can be disabled only before completing the Questionnaire. On the Review & Confirm stage, it is possible to return to the previous stage and retake the Questionnaire. If Data Privacy Requirements are not scoped for the release, the Data Protection & Privacy Review is automatically considered not applicable. Setting Privacy Risk = No Risk also makes DPP not applicable.\                                                                                                                                                    |
|                                                                                               | On the Manage and next stage the release can only be cancelled or inactivated, after which DPP can be disabled on the product details page.                                                                                                                                                                                                                                                                                                                                                                                                                               |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Brand Label                                                                                   | Toggle Button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Vendor                                                                                        | Free text field, mandatory if the Brand Label is turned on                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Commercial Reference Number                                                                   | Free text field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Description                                                                           | Provide a description of the product. It is possible to format the text, add links, tables, pictures.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Organization                                                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Org Level 1                                                                                   | Dropdown field with the list of BU level organizations available to the user (it depends on the scope). The field is mandatory.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Org Level 2                                                                                   | Dropdown field with list of Department/LOB level values depending on the selection of Org Level 1. The field is mandatory.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Org Level 3                                                                                   | Dropdown field with list of LOB/Entity level values depending on the selection of Org Level 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Cross Organizational Development                                                              | Toggle button. Enable it if the product is owned by one team and developed by another one. Once enabled, additional fields 'Development Org Level 1', 'Development Org Level 2', 'Development Org Level 3' appear.                                                                                                                                                                                                                                                                                                                                                        |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Development Org Level 1                                                                       | Dropdown field. Specify a business unit of the development team.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Development Org Level 2                                                                       | Dropdown field. Specify s line of business of the development team.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Development Org Level 3                                                                       | Dropdown field. Specify an entity the development team belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Team (all fields are mandatory)                                                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Owner                                                                                 | Look-up field. Specify the owner of your product here.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security Manager                                                                              | Look up field. Specify the security manager of your product.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security and Data Protection Advisor                                                          | Look up field. Specify the security advisor of your product                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Process Quality Leader                                                                        | Look-up field. Specify PQL for the product.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Dedicated Privacy Advisor                                                                     | This field is shown only if Data Protection and Privacy is applicable for the product (Data Protection and Privacy toggle button is enabled).                                                                                                                                                                                                                                                                                                                                                                                                                             |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security Summary                                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Minimum Oversight Level                                                                       | Dropdown field. LOV: Team, LOB Security Leader, BU Security Officer. Minimum Oversight Level influences Scope Approver and FCSR Reviewer. Please refer to the table - [Routing and Decision-Making Logic for Scope Approval and FCSR Review Based on Oversight Level and Risk Classification.xlsx](https://schneiderelectric.sharepoint.com/:x:/s/GRCProjectGroup/ER6XF2wPGJ5AsyLfx8TlHXYBrlQZvDF2Wd2f3h7J-yGucQ?e=pRIldC)                                                                                                                                                |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Last BU Security FCSR Date                                                                    | These fields are displayed in view mode when at least one release is created for the product.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Last Full Pen Test Date                                                                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Continuous Penetration Testing                                                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product Configuration                                                                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Show the Process sub-requirements within Release Management process                           | Toggle button, non-mandatory. If enabled, sub-requirements on 'Process Requirements' tab in the release will be shown. Product sub-requirements are always shown in the release.                                                                                                                                                                                                                                                                                                                                                                                          |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Tracking Tools Configuration                                                                  | Shows the list of the tools used for the requirements and issues management of the product as a toggle button.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | To specify the tool used, the user can activate the toggle and add details in the opened fields.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | Note: the tools displayed in the list are integrated with PICASso and can be used to submit requirements or actions to these tools, manage them in these tools and update PICASso status based on the changes completed for the tickets/ requirement objects.                                                                                                                                                                                                                                                                                                             |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | Jira tool can be selected for both Process/Product Requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | Jama integration is available for product requirements only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Jama Project Id (shown and mandatory when "Jama" tracking tool is activated for the product)  | Allows to specify the project id from Jama which is used to manage product requirements of this product.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | Jama Project ID can be found in the link to the requirements in Jama or as the API ID on the Project details.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Jira Source Link (shown and mandatory when "Jira" tracking tool is activated for the product) | Provide a link to the project in Jira (mandatory if Jira is selected as Requirements&Issues Tracking tool)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Jira Project Key (shown and mandatory when "Jira" tracking tool is activated for the product) | Key to the project in Jira. Typically, it is the first letters of the tickets (for instance, PIC for PICASso Jira project) or it also can be found in project settings                                                                                                                                                                                                                                                                                                                                                                                                    |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Product requirements tracking tool                                                            | Allows selecting the tool used for the Product Requirements management from all the tracking tools activated for the product with the following options:                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | -   Not Applicable -- if this option is selected user won't be able to submit Product Requirements to any tool in the releases                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | -   Jama (would be default when "Jama" is activated as the tracking tool) - allows submitting product requirements to Jama and create requirement objects for them.                                                                                                                                                                                                                                                                                                                                                                                                       |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | -   Jira - allows submitting product requirements to Jira and create requirement objects for them.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Process requirements and issues tracking tool                                                 | Allows selecting the tool used for the Process Requirements and actions management from all the tracking tools activated for the product with the following options:                                                                                                                                                                                                                                                                                                                                                                                                      |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | -   Not Applicable -- if this option is selected, user won't be able to submit Process Requirements and actions to any tool in the releases                                                                                                                                                                                                                                                                                                                                                                                                                               |
|                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|                                                                                               | -   Jira - allows submitting Process Requirements and actions to Jira and create requirement objects for them.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
+-----------------------------------------------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

4.  Once Jama or Jira connection details are entered, please test the connection by pressing the button "Test Connection". If the data is entered incorrectly (or if the connection to Jama or Jira server is unavailable at this moment), you'll get an error message.

![](media/image18.png){width="7.90625in" height="3.5416666666666665in"}

If the data entered correctly, you'll get a message with the confirmation of successful connection check.

![](media/image19.png){width="7.90625in" height="3.75in"}

***Note:** Every product in PICASso will get process and product requirements to be met, to track the progress of implementation the statuses are used. If the product team will use Jama or Jira to manage these requirements and get synchronized their statuses with PICASso to avoid manual work, they need to configure the mapping between statuses in PICASso and Jama/Jira. To do so, follow the steps described in [the Status Mapping Configuration section](#status-mapping-configuration).*

5.  Once all you entered product details information and (if needed) Jama or Jira integration details are entered, click on the "Save" button to finish the product creation. If you want to cancel creation of the product, click on "Cancel" button and the product will be dropped. "Reset" button will clear up all fields on the form and would allow to create product from scratch.

6.  When a product is created, a "Releases" tab will be enabled.

![A screenshot of a computer AI-generated content may be incorrect.](media/image20.png){width="7.9in" height="3.3583333333333334in"}

### Product View

To view the product created, the user must go to the "My Products" tab and search for the needed product.

![A screenshot of a computer Description automatically generated](media/image21.png){width="6.69375in" height="2.4006944444444445in"}

Upon clicking on the "Product name" the system will open the "Product Details" form in the preview mode.

![](media/image22.png){width="7.90625in" height="3.84375in"}

Upon clicking on the "Releases" tab the list of the releases for this product can be viewed:

![A screenshot of a computer Description automatically generated](media/image23.png){width="6.69375in" height="2.796527777777778in"}

### Product [Update]{.underline}

The user can update the product details at any time. To do so, the user must go to the "My Products" tab and search for the product that should be updated. Upon clicking on the "Product name" the system will redirect the user to the "Product Details" form.

![](media/image24.png){width="7.90625in" height="3.8333333333333335in"}

#### Product details update

To change the product details, on the opened product details preview form the user should press "Edit Product" button at the bottom of the form. The form will become available for editing.

![](media/image25.png){width="7.90625in" height="3.875in"}

***Please note!!!** "Product Type" and 'Product Definition' fields is editable, but changing it can impact product requirements scoping. To re-scope the requirements, re-submit the questionnaire (it can be done on Creation&Scoping stage only).*

When all changes are entered, please click on "Save" button and changes will be saved. "Cancel" button will cancel all changes and bring the user back to the product view mode, while "Reset Form" button will revert all the added changes leaving the product details page opened in the edit mode.

![](media/image26.png){width="7.90625in" height="0.3020833333333333in"}

#### Status Mapping Configuration

If the product team will use Jama or Jira to manage process and product requirements or actions and get synchronized their statuses with PICASso to avoid manual work, they need to configure the mapping between statuses in PICASso and Jira.

To add/update the Status Mapping Configuration for the product, on the opened product details the user should:

1.  Press the "Edit Product" button at the bottom of the form. The form will become available for edits.

2.  Go to 'Product Configuration' and click on the "Status Mapping Configuration" link for the respective tool -- the link displayed near the activated tool will open the corresponding Status Mapping Configuration to configure PICASso status to Jira status or PICASso status to Jama status accordingly.

![](media/image27.png){width="7.90625in" height="3.0833333333333335in"}

3.  On the opened Status Mapping Configuration form select "PICASso Status" from the drop-down list and specify the name of the corresponding "JamaStatus" or "Jira Status" from the Jama/Jira project linked to this product.

And confirm adding mapping with this combination.

![](media/image28.png){width="7.063220691163605in" height="3.2291666666666665in"}

4.  The message of successfully added mapping is returned and mapping line is added to the table:

![](media/image29.png){width="7.90625in" height="5.125in"}

5.  Repeat these steps for all the possible statuses combinations on all the tabs in this form

> ***Note:** incorrect combination can be removed by clicking on the bin icon under the "Remove" column.*

6.  Click the "Confirm" button to save this configuration or click on the "Cancel" button if the added configuration should not be saved for this product.

> ***Note:** 1. The Status Mapping Configuration would be updated for this product only when the "Save" button on the Product Details page is clicked and all the changes added for the product would be saved.*
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

To access the history, navigate to 'Product Details' page and find 'View History' link:

![](media/image30.png){width="7.9in" height="3.8513888888888888in"}

Click this link to open Product Change History pop-up:

![A screenshot of a computer AI-generated content may be incorrect.](media/image31.png){width="7.9in" height="3.8270833333333334in"}

Upon clicking the \"View History\" link, a pop-up window appears displaying a table of all changes made to the product. The table includes the following columns:

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Column Name   Description
  ------------- --------------------------------------------------------------------------------------------------------------------------------------------------------
  Date          Displays the exact date and time of each change in the format: **dd mm yyyy hh mm**. Records are sorted in descending order by default (newest first).

  User          Shows the name and profile image of the user who performed the activity.

  Activity      Describes the type of change made (e.g., Product creation, Product details editing).

  Description   Provides detailed information about the action taken.
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

![A screenshot of a computer AI-generated content may be incorrect.](media/image32.png){width="7.9in" height="3.857638888888889in"}

-   If the number of records exceeds the default display limit, pagination controls appear below the table.

-   A dropdown menu allows users to select how many records to display per page: **10, 20, 50, or 100** (default is 10).

![A screenshot of a computer AI-generated content may be incorrect.](media/image33.png){width="7.9in" height="3.842361111111111in"}

The Product Change History pop-up provides several filtering options to help users find specific records:

-   **Search Input**: Filter records by entering keywords related to the User or Description fields.

-   **Activity Dropdown**: Select from a list of all possible activities to filter the table by activity type.

-   **Date Range Selector**: Choose a specific date range to view only the logs within that period.

![A screenshot of a computer AI-generated content may be incorrect.](media/image34.png){width="7.9in" height="3.8430555555555554in"}

-   If no records match the applied filters, the message **\"There is no data matching selected filter\"** is displayed below the filters.

![A screenshot of a computer AI-generated content may be incorrect.](media/image35.png){width="7.9in" height="3.942361111111111in"}

The following user actions are tracked and displayed in the Product Change History table:

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Trigger                                                                                                     Activity                                    Description (as displayed in the system)
  ----------------------------------------------------------------------------------------------------------- ------------------------------------------- ------------------------------------------------------------------------------------------------------
  Product is created                                                                                          Product creation                            A product **\<Product_Name\>** has been created

  Product Name is updated                                                                                     Product details editing                     Product Name is changed from **\<old value\>** to **\<new value\>**

  Product State is updated                                                                                    Product details editing                     Product State is changed from **\<old value\>** to **\<new value\>**

  Product Definition is updated                                                                               Product details editing                     Product Definition is changed from **\<old value\>** to **\<new value\>**

  Product Type is updated                                                                                     Product details editing                     Product Type is changed from **\<old value\>** to **\<new value\>**

  Commercial Reference Number is updated                                                                      Product details editing                     Commercial Reference Number is changed from **\<old value\>** to **\<new value\>**

  Data Protection & Privacy toggle is activated/deactivated                                                   Data Protection & Privacy details editing   Data Protection & Privacy toggle is activated/deactivated

  Brand Label toggle value is activated/deactivated                                                           Product details editing                     Brand Label toggle is activated/deactivated

  Vendor is updated                                                                                           Product details editing                     Vendor is changed from **\<old value\>** to **\<new value\>**

  Product Description is updated                                                                              Product details editing                     Product Description is updated

  Digital Offer toggle is activated/deactivated                                                               Digital Offer details editing               Digital Offer toggle is activated/deactivated

  VESTA ID is added/removed                                                                                   Digital Offer details editing               VESTA ID **\<VESTA ID\>** is added/removed

  VESTA ID is updated                                                                                         Digital Offer details editing               VESTA ID is changed from **\<old value\>** to **\<new value\>**

  IT Owner is updated                                                                                         Digital Offer details editing               IT Owner for VESTA ID **\<VESTA ID\>** is changed from **\<old value\>** to **\<new value\>**

  Project Manager is updated                                                                                  Digital Offer details editing               Project Manager for VESTA ID **\<VESTA ID\>** is changed from **\<old value\>** to **\<new value\>**

  Org level 1/2/3 fields are updated                                                                          Product Organization editing                **\<Org Level 1/2/3\>** is changed from **\<old value\>** to **\<new value\>**

  Development Org level 1/2/3 fields are updated                                                              Product Organization editing                **\<Development Org Level 1/2/3\>** is changed from **\<old value\>** to **\<new value\>**

  Product Owner is updated                                                                                    Product Team editing                        Product Owner is changed from **\<old value\>** to **\<new value\>**

  Security Manager is updated                                                                                 Product Team editing                        Security Manager is changed from **\<old value\>** to **\<new value\>**

  Security and Data Protection Advisor is updated                                                             Product Team editing                        Security and Data Protection Advisor is changed from **\<old value\>** to **\<new value\>**

  Process Quality Leader is updated                                                                           Product Team editing                        Process Quality Leader is changed from **\<old value\>** to **\<new value\>**

  Dedicated Privacy Advisor is updated                                                                        Product Team editing                        Dedicated Privacy Advisor is changed from **\<old value\>** to **\<new value\>**

  Minimum Oversight Level is updated                                                                          Security Details editing                    Minimum Oversight Level is changed from **\<old value\>** to **\<new value\>**

  Jama tool is activated/deactivated                                                                          Tracking Tools editing                      Jama tool is activated/deactivated

  Jama Project Id is updated                                                                                  Tracking Tools editing                      Jama Project Id is changed from **\<old value\>** to **\<new value\>**

  Jama Status Mapping Configuration was updated                                                               Tracking Tools editing                      Values for Jama

  Status Mapping Configuration were updated                                                                                                               

  Jira tool is activated/deactivated                                                                          Tracking Tools editing                      Jira tool is activated/deactivated

  Jira source link is updated                                                                                 Tracking Tools editing                      Jira Source link value is changed from **\<old value\>** to **\<new value\>**

  Jira Project Key is updated                                                                                 Tracking Tools editing                      Jira Project Key value is changed from **\<old value\>** to **\<new value\>**

  Jira Status Mapping Configuration was updated                                                               Tracking Tools editing                      Values for Jira Status Mapping Configuration were updated

  Product requirements tracking tool is updated                                                               Tracking Tools editing                      Product requirements tracking tool is changed from **\<old value\>** to **\<new value\>**

  Process requirements and issues tracking tool is updated                                                    Tracking Tools editing                      Process requirements and issues tracking tool is changed from **\<old value\>** to **\<new value\>**

  Show the Process sub-requirements within Release Management process toggle value is activated/deactivated   Product Configuration editing               Show the Process sub-requirements within Release Management process toggle is activated/deactivated

  Data on the Data Protection and Privacy Summary is updated                                                  Data Protection & Privacy details editing   Data on the Data Protection and Privacy Summary is updated
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Release Management

Each release of the product goes through the stages and the assignee from the security team (Security Advisor, LOB Security Leader, BU Security Officer) to perform a task on Review and Confirm and FCSR Review stages is defined based on a few criteria:

-   Minimum Oversight Level value (Team = Security Advisor level; LOB = Security Lead Level, BU=Security Officer Level)

-   Risk Classification value (Initial & Major = Security Officer Level; Minor=Security Lead Level; Insignificant=Security Advisor Level)

-   Last BU Level FCSR date (more than 12 months triggers Security Officer Level oversight)

> Please refer to the table for more details - [Routing and Decision-Making Logic for Scope Approval and FCSR Review Based on Oversight Level and Risk Classification.xlsx](https://schneiderelectric.sharepoint.com/:x:/s/GRCProjectGroup/ER6XF2wPGJ5AsyLfx8TlHXYBrlQZvDF2Wd2f3h7J-yGucQ?e=LimXhz)

#### Release Workflow

High level Release Workflow is depicted on the picture below:

![A chart with green arrows Description automatically generated with medium confidence](media/image36.png){width="6.69375in" height="3.4243055555555557in"}

#### Create & Scope

##### New Release

To create a new release of the product you should open the "Product" from the "My Products" tab. Next to the "Product details" tab there is a 'Release' tab where you click on the 'Create Release' button.

![](media/image37.png){width="7.90625in" height="3.25in"}

Once clicked, the pop-up appears where you can either create completely new release (if there are no releases for this product at all) or existing product release (in case there are releases for this product outside of PICASso)

![](media/image38.png){width="7.90625in" height="3.8125in"}

###### Release Details

Fill the details in the dialog box:

1.  Select if it is a completely new release or existing product release.

2.  Release Version.

3.  Target release date.

4.  Change summary -- provide a short description of the changes to be made in this release.

Note: It is not possible to create a release with the same name/version if the previous release was cancelled. However, if the previous release was inactivated, creating a new release with the same name/version is allowed.

The default option is a 'New Product Release', and 'Existing Product Release' option appears only once when there is not any release created in PICASso for this product. The detailed description of this scenario could be found in the section [Onboarding Release.](#onboarding-release) If you have created 'New Product Release', but there are some releases of this product outside of PICASso, you can cancel existing release and then select the correct option 'Existing Product Release' and create corresponding release.

![A screenshot of a computer Description automatically generated](media/image39.png){width="5.555764435695538in" height="2.5262904636920385in"}

Select 'Continuous Penetration Testing' and provide Cont. Pen Test Contract Date if needed. 'Create and Scope' to create a release.

![](media/image40.png){width="7.90625in" height="3.7395833333333335in"}

Post the creation of the release, it will appear in the list. All the releases are available on this page in their respective states. By default, only ongoing releases are shown. But if you disable 'Show Active Only' toggle button, 'Completed', 'Cancelled' and 'Inactive' releases will be shown (if any).

![A screenshot of a computer AI-generated content may be incorrect.](media/image41.png){width="7.9in" height="3.8847222222222224in"}

Click on the Release number from the 'Release' column and you will be directed to the release level page and verify the information as below.

![](media/image42.png){width="7.90625in" height="3.875in"}To view the progress of the project, click on 'View Flow' and the track workflow will appear as shown below.

![](media/image43.png){width="7.90625in" height="3.8854166666666665in"}

####### 2.6.2.1.1.1. Workflow Fields

-   Number of Submissions Needed/Done: Displays the total number of submissions required to progress to the next workflow stage. Updates dynamically to show how many submissions have been completed so far.

-   Usernames of Responsible Individuals: Displays the names of team members responsible for approvals.

-   Date of Submission: Shows the date when the release was submitted to the next stage. This is displayed for all completed stages.

When a release isn\'t submitted to the next stage yet:

-   The system provides real-time information about the approval progress:

I)  The Number of Submissions status is displayed dynamically:

*Example: At the \"SA & PQL Sign Off\" stage, if two submissions are required and one submission has already been received, it will show: 1 of 2 submissions.*

II) A Checkmark will appear next to the name of any approver who has already submitted the release. The number of approvals will be updated accordingly:

*Example: If three approvals are required and two are complete, it will show: 2 of 3 submissions required.*

######## **Special Case for the Creation & Scoping Stage**

If the release is in the \"Creation & Scoping\" stage and the required Questionnaire has not yet been submitted:

a)  The system determines the individuals responsible for the \"Review & Confirm,\" \"FCSR Review,\" and \"Final Acceptance\" stages based on:

-   Minimum Oversight Level,

-   Last BU Security Officer FCSR Date, and

-   Data Protection and Privacy Applicability.

Once the Questionnaire is submitted and the Risk Classification and Privacy Risk are defined, the system will reassess and update the responsible individuals if changes are needed.

*Example:*

*Before Questionnaire Submission:*\
*Minimum Oversight Level is set to \"Team,\" and the Last BU Security Officer FCSR Date is 15/12/2024. For the \"Review & Confirm,\" \"FCSR Review,\" and \"Final Acceptance\" stages, the responsible individual is the Security Advisor.*

*After Questionnaire Submission:*\
*If the Risk Classification is updated to \"Initial,\" the responsible individual changes to the BU Security Officer. The workflow is automatically updated accordingly.*

######## **Workflow Updates Upon Submission**

Once a responsible individual submits the release for the next stage, under completed stage completion date will be displayed:

![A green line with black text AI-generated content may be incorrect.](media/image44.png){width="7.094739720034996in" height="1.250174978127734in"}

######## **Assignment Logic**

Assignment is handled dynamically by the system based on backend logic. Below is a detailed explanation of the assignment rules at each stage.

**Stage-Specific Assignments**

+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| Stage                                                                                                         | Responsible roles                                                                                                |
+===============================================================================================================+==================================================================================================================+
| Creation and Scoping                                                                                          | Product Owner or Security Manager                                                                                |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| Review&Confirm                                                                                                | Security Advisor/LOB Security Leader/BU Security Officer + Privacy Advisor (if DP is applicable for the release) |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| Manage                                                                                                        | Product Owner/Security Manager/Security Advisor                                                                  |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| SA&PQL Sign Off (if DP is not applicable)                                                                     | Security Advisor and Process Quality Leader                                                                      |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| Security and Privacy Readiness Sign Off (if Data Protection and Privacy Review is applicable for the release) | Security Advisor, Process Quality Leader, Privacy Reviewer                                                       |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| FCSR Review                                                                                                   | Security Advisor/LOB Security Leader/BU Security Officer. If exception required: CISO and/or SVP LOB             |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| Post FCSR Actions                                                                                             | Product Owner/Security Manager                                                                                   |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+
| Final Acceptance                                                                                              | Security Advisor/LOB Security Leader/BU Security Officer -- if FCSR Decision is Go with Pre-Conditions           |
|                                                                                                               |                                                                                                                  |
|                                                                                                               | PO/SM - if FCSR Decision is Go or Go with Post-Conditions                                                        |
+---------------------------------------------------------------------------------------------------------------+------------------------------------------------------------------------------------------------------------------+

*Stage Assignment Example*

*Scenario:*

*Minimum Oversight Level: Team*

*Last BU Security Officer FCSR Date: 15/12/2024*

*Based on this information:*

*Before Questionnaire Submission:*\
*At \"Review & Confirm,\" \"FCSR Review,\" and \"Final Acceptance\" stages, the Security Advisor is responsible.*

*After Questionnaire Submission:*\
*Upon the questionnaire submission, Risk Classification is updated to \"Initial.\" The responsibility transitions to the BU Security Officer, and this update is reflected in the system.*

####### Associated Products on the Release Details

1.  **Section Title**

The section is titled **\"Reference to Schneider Electric Products\"** and includes two tabs:

-   **Included SE Components**

-   **Part Of SE Products**

![A screenshot of a computer AI-generated content may be incorrect.](media/image45.png){width="7.9in" height="3.8881944444444443in"}

######## **Included SE Components Tab**

This tab displays products that are **included in the current product\'s release**. Each listed product includes detailed information, actionable buttons, and scrolling to accommodate long lists.

![A screenshot of a computer AI-generated content may be incorrect.](media/image46.png){width="7.9in" height="2.013888888888889in"}

######### **Table Columns and Data**

-   **Product Name**: Name of the associated product.

-   **Release Number**: The release number for the associated product (if available).

    -   **Note**: Only one release can be selected per product.

-   **Latest Release Number**: A read-only field showing the most recent release for the product in PICASso.

    -   **Warning Icon**: If the values in the \"Release Number\" and \"Latest Release Number\" fields differ, a warning icon is displayed with the tooltip:\
        *\"Release Number and Latest Release Number differ; please analyze and plan to update if necessary.\"*

    -   **Determination of Latest Release**: The latest release is the one with the most recent \"Completed\" status date.

-   **FCSR Decision**: The FCSR (Formal Cyber Security Review) decision for the release.

    -   \"No Go\" decisions are highlighted in red.

-   **FCSR Date**: Date of the FCSR review (if available). Only past dates (up to TODAY) are allowed.

-   **Product Type**: Type of the product (e.g., System, Embedded Device).

-   **Product Definition**: Definition of the product (e.g., System, Component).

-   **Security and Data Protection Advisor**: The associated Security Advisor for the product.

-   **Status**: Indicates the product\'s record status in PICASso (Active).

    -   For manually added products (see below), this field will remain empty.

> **Action Buttons**

![A screenshot of a computer AI-generated content may be incorrect.](media/image47.png){width="4.575396981627296in" height="2.475214348206474in"}

-   **Edit Button**

Allows users to:

-   Select a different release from PICASso if available.

-   Enter release and its details manually if the desired release is not registered in PICASso.

-   Update all fields for manually added products.

![A screenshot of a computer AI-generated content may be incorrect.](media/image48.png){width="7.9in" height="4.040277777777778in"}

-   **Remove Button**

![A screenshot of a computer error AI-generated content may be incorrect.](media/image49.png){width="4.1672484689413825in" height="2.0315332458442694in"}

Allows users to remove a product from the list. Upon removal:

-   The product is deleted from the **\"Included SE Components\"** tab.

-   It is also removed from related sections, such as:

    -   **SE Brick/Library/Platform** of the Cybersecurity Residual Risks → 3rd Party Suppliers & SE Bricks.

    -   **System Design** of the Cybersecurity Residual Risks → System Design section.

-   The current product is removed from the **\"Part Of SE Products\"** tab for the removed product.

<!-- -->

-   **Add Product Button**

![A screenshot of a computer AI-generated content may be incorrect.](media/image50.png){width="7.9in" height="1.7375in"}

Allows users to:

-   Add products already registered in PICASso.

-   Manually add products not registered in PICASso (see detailed guide below).

![A screenshot of a computer AI-generated content may be incorrect.](media/image51.png){width="7.9in" height="3.854861111111111in"}

> **Empty State for Included SE Components**

If no products are associated with the current product, the tab will display the following:

-   **Add SE Product Button**: Allows the user to add products.

-   **Empty State Message**: Displays *\"There are no SE products included in this product.\"*

![A screenshot of a computer AI-generated content may be incorrect.](media/image52.png){width="7.9in" height="2.4555555555555557in"}

2.  **Adding Products to the Included SE Components Tab**

######### Add SE Product Button (Registered Products in PICASso)

3.  Click **Add SE Product**.

4.  A pop-up appears for product search or manual adding.

5.  **Search for a registered product** by:

    -   Entering the product name in the **Product Name** field (shows active products in PICASso).

    -   Selecting a specific release in the **Release Number** dropdown (shows all valid releases, or \"Release not found\").

![A screenshot of a computer AI-generated content may be incorrect.](media/image53.png){width="7.9in" height="3.83125in"}

-   **Adding Releases Not Registered in PICASso**

If the release is not found, select **\"Release not found\"** and enter release details manually:

-   **Release Number**: Required.

-   **FCSR Decision**: Dropdown with valid FCSR values. (Optional)

-   **FCSR Date**: Required if FCSR decision is provided. Only past dates are allowed.

![A screenshot of a computer AI-generated content may be incorrect.](media/image54.png){width="7.9in" height="3.825in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image55.png){width="7.9in" height="3.0131944444444443in"}

After completing the form, click **Save**. Upon confirmation:

1.  The product appears in **Included SE Components**.

2.  Depending on its type:

    -   **Brick/Library/Platform**: Added to **Cybersecurity Residual Risks → 3^rd^ Party Suppliers& SE Bricks** section.

    -   Other types: Added to **Cybersecurity Residual Risks → System Design** section.

3.  The current product is added to the **Part of SE Products** tab of the associated product.

######### **Manually Adding Products Not Registered in PICASso**

If the product is not registered in PICASso:

1.  Select **Create New Dependencies with SE Product**.

2.  Fill in the following fields:

    -   **Product Name**: Name of the product.

    -   **Product Type**: Dropdown (e.g., System, Embedded Device).

    -   **Product Definition**: Dropdown (e.g., Component, System).

    -   **Release Number**: Number of the release.

    -   **FCSR Decision** (Optional): Dropdown with valid values.

    -   **FCSR Date** (Optional): Must be a past date (≤ TODAY).

![A screenshot of a computer AI-generated content may be incorrect.](media/image56.png){width="7.9in" height="3.8048611111111112in"}

If a product is already included in the current release (on either tab), the system will:

1.  Return an error message: *\"This product has already been added to the list.\"*

2.  Prevent the addition of duplicate products.

######## **Part Of SE Products Tab**

The **Part of SE Products** tab provides a **read-only** list of products in which the current product is included.

######### Table Columns and Data

-   **Product Name**: Name of the associated product.

-   **Release Number**: The release number of the associated product.

-   **FCSR Decision**: The FCSR decision for the release (\"No Go\" highlighted in red).

-   **FCSR Date**: Date of the FCSR review.

-   **Product Type**: Type of the product (e.g., System, Embedded Device).

-   **Product Definition**: Definition of the product (e.g., System, Component).

-   **Security Advisor**: Security Advisor associated with the product.

-   **Status**: Status in PICASso (Active).

![A white rectangular object with text AI-generated content may be incorrect.](media/image57.png){width="7.9in" height="2.2944444444444443in"}

######### Limitations

-   Users cannot **edit**, **remove**, or **add** products from this tab. It is strictly for reviewing linked products.

###### Roles & Responsibilities

Navigate to 'Roles and Responsibilities' section to view key SDL roles. This is for information only and will be defaulted to the individuals assigned in the ["Product Details"](#new-product-creation) screen and in the BackOffice.

![A screenshot of a computer Description automatically generated](media/image58.png){width="6.897306430446195in" height="3.3472222222222223in"}

Under the section, 'Product roles' select individuals playing these roles in the release and make changes when required.

NOTE!!! These individuals will not have access to the PICASso and will not perform any action/task here.

![A screenshot of a computer Description automatically generated](media/image59.png){width="6.69375in" height="1.4361111111111111in"}

Identify the role/s an individual is required to be assigned from the table above and follow the below steps to assign the roles to a particular user.

1)  To assign a new individual for a role, click on "+ADD USER" if you are adding a new individual or click on pencil icon under "TEAM MEMBERS" column to add an individual to the role. Type of the name of the individual and select from the drop down.

2)  To replace an individual in a role, click on the \"Pencil\" icon next to the current individual\'s name. Select the new individual from the drop-down menu.

3)  To remove an individual from a role, navigate to the Roles and Responsibilities tab. Identify the individual you want to remove and click on the \"Bin\" icon. 

4)  Please verify the email address and location that should auto populate when an individual is selected. 

5)  Please note that SDL roles are added by default.

[Note.]{.underline} Filling 'Product Roles' section is optional on this stage. It will become mandatory on the 'Manage' stage.

###### Questionnaire

Navigate to 'Questionnaire' Tab and click on 'Start Questionnaire' button to define Process and Product Requirements.

![](media/image60.png){width="6.611111111111111in" height="3.195551181102362in"}

After clicking on the \'Start Questionnaire\' button, the list of questions will appear. Answer all the questions, then click on \'Submit\' at the bottom right corner of the screen. If any required questions are not answered, an error message will appear, prompting you to answer all required questions. Provided answers are automatically saved every 1 minute, but to scope the requirements and move on, you need to provide an answer to each question and submit the questionnaire.

![](media/image61.png){width="7.90625in" height="3.8645833333333335in"}

After submitting, Process and Product Requirements Tabs will become available.

When the questionnaire is completed, the system automatically calculates the Privacy Risk (if Data Protection and Privacy is applicable) and Risk Classification value based on the business rules.

![](media/image62.png){width="7.90625in" height="3.8229166666666665in"}

###### Process Requirements

Navigate to the Process Requirement tab. Here you can see a list of generated requirements. They are sorted by SDL Practices and collapsed by default.

![](media/image63.png){width="7.90625in" height="3.8645833333333335in"}

When you expand an SDL Practice, you will see the list of requirements with its name, description, and status:

![](media/image64.png){width="7.90625in" height="3.8541666666666665in"}

2.6.2.1.4.1 Showing or Hiding Sub-Requirements

The setting \"Show the Process sub-requirements within Release Management process\" on the 'Product Details' page affects how the Process Requirements page displays parent requirements and their sub-requirements.

![](media/image65.png){width="7.90625in" height="3.84375in"}

**Behaviour Based on Setting Configuration**

Unchecked Setting: The Process Requirements page displays only the parent requirements, without sub-requirements.

![](media/image66.png){width="7.90625in" height="3.75in"}

On the Product Requirements tab, both requirements and sub-requirements are visible regardless of this setting.

Checked Setting:

Both requirements and sub-requirements are visible on both the Process Requirements page and Product Requirements tab.

![](media/image67.png){width="7.90625in" height="3.8333333333333335in"}

######## **Trigger-Condition Logic**

The visibility of sub-requirements depends on product-specific triggers and scoping logic. Below are the rules for handling visibility:

-   Sub-requirement Applicable but Parent Requirement Not Applicable:

Parent requirements are visible on the Process Requirements page, but sub-requirement visibility depends on the setting.

-   Parent Requirement Applicable but Sub-requirement Not Applicable:

Parent requirements are visible, and sub-requirement visibility still depends on the setting.

-   Both Parent and Sub-requirement Applicable:

Parent requirements are always shown, and sub-requirement visibility follows the setting.

-   Neither Parent nor Sub-requirement Applicable:

Neither parent nor sub-requirements are displayed.

2.6.2.1.4.2 Expanding and Collapsing Sub-Requirements

When sub-requirements are visible, users can manage their display using the following controls:

**Default View**

Sub-requirements are collapsed by default on the Process Requirements and Product Requirements tabs.

![](media/image68.png){width="7.90625in" height="2.1145833333333335in"}

**Expand/Collapse Controls**

Users can expand/collapse sub-requirements for a specific parent requirement by clicking the arrow icon next to the parent requirement name:

![](media/image69.png){width="7.90625in" height="2.687522965879265in"}

Clicking once expands the list of sub-requirements.

![](media/image70.png){width="7.90625in" height="2.3229166666666665in"}

Clicking again collapses the list.

**Show All Sub-Requirements**

The toggle "Show All Sub-Requirements" lets users expand/collapse all sub-requirements associated with visible parent requirements.

Toggle On: All sub-requirements are expanded.

![](media/image71.png){width="7.90625in" height="3.8645833333333335in"}

Toggle Off: All sub-requirements are collapsed.

![](media/image72.png){width="7.90625in" height="3.71875in"}

[Notes]{.underline}

No Sub-requirements Available:

If no sub-requirements exist for a parent requirement, 'Show sub-requirements\' toggle and the arrow icon is not displayed.

![](media/image73.png){width="7.90625in" height="3.8645833333333335in"}

**Filtering Requirements by SDL Practice**

To filter the requirements by specific SDL Practice, navigate to filter panel and select practice from the dropdown list:

![](media/image74.png){width="7.90625in" height="3.8854166666666665in"}Once the filter is applied, you will see the list of requirements from selected SDL Practice:

![](media/image75.png){width="7.90625in" height="3.8333333333333335in"}

**Filtering Requirements by Status**

Users can refine their view of requirements and sub-requirements by applying status filters.

-   Using the Status Filter

Filter Panel:

Click on the "Status" filter dropdown.

![](media/image76.png){width="7.90625in" height="1.1875153105861767in"}

Select the desired status from the list:

![](media/image77.png){width="7.90625in" height="3.8541666666666665in"}

Filtered View:

Only requirements (and their sub-requirements, if visible) with the selected status will be shown.

![](media/image78.png){width="7.90625in" height="3.84375in"}

[Note.]{.underline} If sub-requirement has selected status, but its parent has a different status, this parent requirement will be shown as well.

*Example. **IEC62443-4-2:2019 ISA/IEC62443-4-2:2019 Component Requirements** (parent) has status 'Planned', sub-requirement 'IEC62443-4-2:2019-EDR-SL1-01 EDR 2.4 - Mobile code' has status 'Done'. When filtering by 'Done' status, parent requirement will be shown:*

![A screenshot of a computer AI-generated content may be incorrect.](media/image79.png){width="7.9in" height="2.38125in"}

Empty State:

If no requirements meet the selected status, an empty message is displayed:

![](media/image80.png){width="7.90625in" height="3.8229166666666665in"}

**Reset Filters**

Click "Reset" to clear all selected statuses and refresh the page, showing all requirements and sub-requirements.

![](media/image81.png){width="7.90625in" height="1.375in"}

Hierarchical and Ordered View of Requirements

Requirements and sub-requirements are displayed hierarchically and sorted by their Requirement Order Code.

The hierarchy follows this format:

Level 1: Category/SDL Practice (e.g., \"Authentication\")

Level 2: Parent Requirements (e.g., CAL-0 California Connected Devices Law)

Level 3: Sub-requirements (e.g., CAL-2, CAL-3)

**Requirement Selection and Bulk Changes**

**Selecting Requirements**

Individual Selection:

Select any parent requirement or sub-requirement by ticking the checkbox next to the requirement name.

![](media/image82.png){width="7.90625in" height="3.1354166666666665in"}

When a parent requirement is selected, its sub-requirements are also selected (unless hidden).

![](media/image83.png){width="7.90625in" height="3.8125in"}

Removing Selection:

Unselect individual requirements or sub-requirements as needed.

Refresh the page or click the "Remove Selection" button to clear all selections.

**Bulk Edit**

Once requirements are selected, the "Edit" button becomes enabled.

![](media/image84.png){width="7.90625in" height="3.8333333333333335in"}

Bulk Edit Form:

-   Clicking the button opens a pop-up form with fields for:

<!-- -->

-   Status Update: Change the status of selected requirements/sub-requirements.

-   Evidence Link: Add a link to supporting evidence.

-   Justification: Provide justification for the status change.

<!-- -->

-   Saving Changes: Click "Save" to update selected requirements with the new status, evidence link, and justification.

-   Canceling Changes: Click "Cancel" or the "X" icon to discard changes. Selections remain intact.

![](media/image85.png){width="7.90625in" height="3.875in"}

From the dropdown menu in the 'Status' field, you can select multiple statuses, such as Not Applicable or Postponed. Once selected, click on Save to close the dialog box.

![](media/image86.png){width="7.90625in" height="3.875in"}

The 'Justification' field will become mandatory if you choose 'Not Applicable' or 'Postponed' status.

![](media/image87.png){width="6.8422594050743655in" height="3.2919520997375327in"}

Evidence link must be provided for the requirements with 'Done' status.

![](media/image88.png){width="6.758919510061243in" height="3.266948818897638in"}

Hover over 'more' link to see the full description of the requirement:

![](media/image89.png){width="7.90625in" height="3.8541666666666665in"}

To edit the status of each specific requirement and insert connected links, click on three dots next to the status label:

![](media/image90.png){width="7.90625in" height="2.3333333333333335in"}

Enable 'Show all requirements' toggle button to view all requirements irrespective of their status. This way, the requirements which weren't scoped for the release (have 'Not Selected' status) are also visible.

![](media/image91.png){width="7.90625in" height="3.7708333333333335in"}

You can add requirements that weren't scoped (they have 'Not Selected' status). There are two ways to do so.

The first option is to add each requirement manually. Click on three dots, then 'Add', and provide a justification why you need to add this requirement.

![](media/image92.png){width="7.90625in" height="3.8229166666666665in"}![](media/image93.png){width="7.90625in" height="3.8645833333333335in"}

If you want to remove this requirement, click on three dots again, then 'Remove' button and provide mandatory rationale for the removal.

![](media/image94.png){width="7.90625in" height="3.6875in"}![](media/image95.png){width="7.90625in" height="3.8020833333333335in"}The second option to add not selected requirements in a bulk (in case you need to add many items). To do so, use the checkboxes to select the requirements and then click on 'Add' button in Bulk Actions section:

![](media/image96.png){width="7.90625in" height="3.8541666666666665in"}

If there is a need to re-scope requirements, navigate to the 'Questionnaire' tab to review the responses to the questionnaire answered at 2.6.2.1.3. At the bottom of the screen, use the \"Edit Answers\" option to make changes to these responses.

![](media/image97.png){width="7.90625in" height="3.8958333333333335in"}

Submit the new answers and verify the Privacy Risk and Risk Classification. It can be re-calculated depending on the answers provided. Process and Product Requirements can be rescoped as well.

###### Product Requirements

Navigate to the 'Product requirements' Tab to see a list of product requirements. 

The requirements are grouped by product categories and collapsed by default.

![](media/image98.png){width="7.90625in" height="3.84375in"}

To expand the product category, click on 'Arrow' icon.

![](media/image99.png){width="7.90625in" height="3.84375in"}

You will see requirement name, description, Must/Should value (criticality of the requirement implementation), sources, and requirement status.

![](media/image100.png){width="7.90625in" height="1.9583333333333333in"}

Hover over 'More' link in the description column to see full description of the requirement.

![](media/image101.png){width="7.90625in" height="3.8333333333333335in"}

To change the status, click on three dots next to status label, select status from the list, provide evidence and justification if needed.

![](media/image102.png){width="4.959025590551181in" height="4.5006277340332455in"}

To edit requirements in bulk, use checkboxes to select the requirements you want to edit, then click on 'Edit' button:

![](media/image103.png){width="7.90625in" height="3.8541666666666665in"}

A pop-up will appear where you need to select status from the list, provide evidence and justification if needed:

![](media/image104.png){width="7.90625in" height="3.8229166666666665in"}

You can search the requirement by its name, filter by product category, sources and requirement status.

There is also a group of toggle buttons to work with requirements display (the same as for Process Requirements Tab): Show sub-requirements, show all requirements (which were not scoped for the release) and show only new requirements (that was added to the system after release creation and questionnaire re-submission)

![](media/image105.png){width="7.90625in" height="0.9479254155730533in"}

###### 2.6.2.1.6. Process and Product Requirements Status upload

In addition to the manual edits of the Process and Product requirement\'s and sub-requirement\'s status, the Product Team and Security/Privacy Advisor (acting on behalf of the Product Team) can update the completion status of the requirements/sub-requirements with the file upload.

  ---------------------------------------------------------------------------------------------------------------------------------------
  **Responsible roles**     Product Owner, Security Manager and Security Advisor/Privacy Advisor (acting on behalf of the Product Team)
  ------------------------- -------------------------------------------------------------------------------------------------------------
  **Release flow stages**   Creation & Scoping, Review & Confirm, Manage

  ---------------------------------------------------------------------------------------------------------------------------------------

Users can upload requirements using Excel export file to streamline updates and manage requirements efficiently. Additionally, the functions and rules governing requirements file uploads are explained in detail.

####### 2.6.2.1.6.1. Requirements File Upload Overview

Users can update Process and Product requirements statuses by exporting the list of requirements via clicking on 'Export XSLX' button:

![](media/image106.png){width="7.90625in" height="3.8333333333333335in"}

The downloaded file will contain two tabs: Instructions and Data. On the 'Instructions'

Tab there is guidance on how to fill in the information on the Data tab. Please note, that you can only edit 'Status', 'Evidence', and 'Justification' columns. If you change something in other columns, these changes will be skipped by the system.

For products managed in Jira, on the 'Data' tab there will be additional column called 'Source link', if the requirement is sent to Jira. If you try to update the status, evidence or justification for such requirements, the changes won't be applied, because the requirement status can be only edited in Jira.

Once you've updated the required information, save the changes and upload the file back to the system using the 'Import XSLX' button.

![](media/image107.png){width="7.90625in" height="3.875in"}Once the file is added, the system shows an information message:

![](media/image108.png){width="7.90625in" height="3.78125in"}While uploading is in progress, it will be displayed under Import/Export buttons:

![](media/image109.png){width="3.2191994750656168in" height="0.9167946194225722in"}

In case of any errors, it will be displayed in the same place:

![](media/image110.png){width="4.198502843394576in" height="1.0209755030621173in"}

To see which rows contain the error, click on 'Errors' link and the system will open a pop-up. Correct the mistakes and upload the file again.

![](media/image111.png){width="7.90625in" height="3.84375in"}File upload takes some time. After successful upload the page will be refreshed automatically.

You can remove rows in the file, if you need to update only specific requirements. The requirements order corresponds to the order in the Backoffice. You can change the order at your convenience. But removing/reordering of the columns is prohibited. If some changes were made in the columns order and you try to upload such file, the system will return an error:

![](media/image112.png){width="7.90625in" height="3.8541666666666665in"}

###### 2.6.2.1.7. Process and Product Requirements Summary

Requirements Status Summary feature is available on the Process Requirements and Product Requirements pages. This feature provides a visual summary of the status of all requirements scoped (or manually added) for a release in the form of a pie chart.

![A screen shot of a computer AI-generated content may be incorrect.](media/image113.png){width="7.9in" height="3.8819444444444446in"}

On the **Process Requirements** and **Product Requirements** pages, users will see a new link: **\"Requirements Status Summary\"**

![A screenshot of a computer AI-generated content may be incorrect.](media/image114.png){width="7.9in" height="3.303472222222222in"}

Clicking this link will open a pop-up window that contains the following:

-   A pie chart diagram showing the percentage breakdown of requirements based on their current statuses.

-   Functions for filtering and customizing the data visualized on the pie chart: filter by SDL Practice/Category, Source (for Product Requirements) and 'Include Sub-requirements' toggle button (disabled by default).

![A screenshot of a computer AI-generated content may be incorrect.](media/image115.png){width="7.9in" height="4.164583333333334in"}

When the **Requirements Status Summary** chart is opened, it will show:

1.  **All scoped and manually added requirements for the release**, aggregated for the respective tab (Process Requirements or Product Requirements).

2.  The requirements will be grouped by their statuses, and each slice of the pie chart will show:

    -   Status (e.g., Done, In Progress, Not Applicable, Planned, Postponed)

    -   The percentage and number of requirements in that status calculated from the total.

For example:\
If for the **\"Secure by Design\"** practice there are 17 requirements:

-   **4 are Done** = 23.53% of the total

-   **4 are In Progress** = 23.53%

-   **4 are Not Applicable** = 23.53%

-   **2 are Planned** = 11.76%

-   **3 are Postponed** = 17.65%

To focus on specific data, users can filter the requirements shown in the pie chart:

**1. Filter by SDL Practice/Category**

Users can select a specific **SDL Practice** or **Category** (e.g., \"Secure by Design,\" \"Threat Modeling\"):

-   The pie chart will be updated to show the status of requirements only for the selected practice or category.

![A screenshot of a computer AI-generated content may be incorrect.](media/image116.png){width="3.5390135608048996in" height="1.8880336832895888in"} ![A screenshot of a computer AI-generated content may be incorrect.](media/image117.png){width="3.505656167979003in" height="1.8887281277340333in"}

**2. Toggle \"Include Sub-Requirements\"**

A toggle button labeled **\"Include Sub-Requirements\"** allows users to decide whether to include sub-requirements in the chart:

-   **By default**: This toggle is deactivated, and only the status of the top-level requirements is shown.

-   **When activated**: The chart also counts the status of sub-requirements toward the total.

![A screenshot of a computer AI-generated content may be incorrect.](media/image118.png){width="7.9in" height="4.245138888888889in"}

**Important Notes for Process Requirements:**

-   If the **\"Show the Process sub-requirements within Release Management process\"** toggle (found on the Product Details page) is **deactivated**, the **\"Include Sub-Requirements\"** toggle will be **hidden** for Process Requirements, as sub-requirements are not relevant in this case.

**How Toggle Affects the Chart**

For example:\
If there are 17 requirements, including 5 sub-requirements:

-   With the **toggle deactivated**, only the status of the 12 top-level requirements is shown.

-   With the **toggle activated**, the status of all 17 requirements (including sub-requirements) is visualized.

**How Percentages Are Calculated in the Chart**

The percentage of each status is calculated as:\
**(Number of requirements in the status / Total number of requirements) × 100%**

For example:\
If 17 requirements apply (including manually added ones):

-   **4 Done**: 4 / 17 × 100% = 23.53%

-   **4 In Progress**: 4 / 17 × 100% = 23.53%

-   **4 Not Applicable**: 4 / 17 × 100% = 23.53%

-   **2 Planned**: 2 / 17 × 100% = 11.76%

-   **3 Postponed**: 3 / 17 × 100% = 17.65%

Each slice of the pie chart will display the percentage and number of requirements for that status.

**User Interface Elements in the Pop-Up**

The pie chart pop-up includes the following components:

**1. Pie Chart Diagram**

-   A graphical representation of the status distribution of the requirements.

-   Dynamic updates based on filters and toggles.

**2. SDL Practice/Category Filter**

-   A dropdown menu showing all SDL Practices or Categories.

-   Selecting a practice/category will update the chart to reflect the filtered requirements.

**3. Toggle: \"Include Sub-Requirements\"**

-   Allows users to include or exclude sub-requirements from the data.

**4. Burger Menu icon:**

-   **View full screen**

-   **Print Chart**

<!-- -->

-   **Download** options are available to export the chart in PNG, JPEG, and SVG Vector format.

![A screenshot of a computer AI-generated content may be incorrect.](media/image119.png){width="6.892263779527559in" height="3.683652668416448in"}

**Error Scenarios**

**1. No Data Available for Selected Filter**

If no requirements match the selected SDL Practice/Category filter:

-   The pie chart will display a message:\
    **\"No data to display\"**

> ![A screenshot of a computer AI-generated content may be incorrect.](media/image120.png){width="7.9in" height="4.209722222222222in"}

**2. Toggle Visibility for Process Requirements**

If **\"Show the Process sub-requirements within Release Management process\"** is deactivated:

-   The **\"Include Sub-Requirements\"** toggle will not appear for the **Process Requirements** tab.

###### 2.6.2.1.8. Adding Project-specific (Custom) Requirements to the Product Requirements Tab

Custom Requirements in PICASso allow users to define, upload, edit, and remove project-specific requirements for a product release. This chapter explains how to add, bulk upload, edit, and remove custom requirements, including validation rules, access privileges, and release history logging.

-   On the **Product Requirements** tab, users with the appropriate privilege will see the **\"Add Custom requirements\"** button (it is available on Creation&Scoping and Review&Confirm stages) :

![A screenshot of a computer AI-generated content may be incorrect.](media/image121.png){width="7.9in" height="3.8541666666666665in"}

Clicking the button opens a pop-up with the following fields:

![A screenshot of a computer AI-generated content may be incorrect.](media/image122.png){width="7.9in" height="3.8541666666666665in"}

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Field                      Type/Control                  Mandatory                  Description
  -------------------------- ----------------------------- -------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Name                       Free Text                     Yes                        Name of the requirement (displayed in the list).

  Code (ID)                  Free Text                     Yes                        Unique identifier. If already exists, error: \"Requirement with this code already exist\".

  Condition                  Radio Buttons (Must/Should)   Yes                        Select \"Must\" or \"Should\".

  Category                   Read Only                     N/A                        Default: \"Custom Requirements\".

  Description                Free Text                     Yes                        Full description of the requirement.

  Source                     Free Text + Dropdown          Yes                        Type the source manually using 'Add Source' button or select from existing sources for custom requirements in this release.

  Add as a sub-requirement   Toggle Button                 N/A                        When enabled, shows \"Parent requirement\" field. Disabled (greyed out) if no custom parent requirements exist.

  Parent requirement         Dropdown                      Yes (if sub-requirement)   Select from existing custom parent requirements.

  Download template          Button                        N/A                        Downloads the template file to the user\'s device. Use Import XSLX button on the Product Requirements tab to upload the template. In case some errors exist in the file, it will be displayed under 'Import XSLX' button.
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

When all information has been provided, click 'Add'.

![A screenshot of a computer AI-generated content may be incorrect.](media/image123.png){width="7.9in" height="3.86875in"}

Newly added requirement will appear in the list on the product requirements tab under 'Custom Requirements' category:

![A screenshot of a computer AI-generated content may be incorrect.](media/image124.png){width="7.9in" height="3.88125in"}

When at least one 'parent' requirement is added to the release, it is possible to create sub-requirements. To do so, click '+Custom requirements' again and in the opened pop-up enable 'Add as sub-requirement' toggle button, then select parent requirement code from the dropdown list:

![A screenshot of a computer AI-generated content may be incorrect.](media/image125.png){width="7.9in" height="3.8680555555555554in"}

As you've added at least one source when creating a parent requirement, now you can select the same source for sub-requirement or create a new source.

![A screenshot of a computer AI-generated content may be incorrect.](media/image126.png){width="7.9in" height="3.7979166666666666in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image127.png){width="7.9in" height="3.8583333333333334in"}

Additionally, provide all the details of the sub-requirement and click 'Add'. New sub-requirement will be displayed in the list under its parent:

![A screenshot of a computer AI-generated content may be incorrect.](media/image128.png){width="7.9in" height="3.8534722222222224in"}

Also there is a possibility to add custom requirements in bulk, by downloading a template and uploading it back to the system.

To download a template for custom requirements, click '+Custom Requirement', and find the corresponding link:

![A screenshot of a computer AI-generated content may be incorrect.](media/image129.png){width="7.9in" height="3.845833333333333in"}

Clicking this link triggers downloading a file. In the template there are two tabs:

-   Instructions: guidance on how to fill the information;

-   Data: a table to provide the details of requirements that need to be added:

![A screenshot of a computer AI-generated content may be incorrect.](media/image130.png){width="7.9in" height="4.129861111111111in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image131.png){width="7.9in" height="4.2034722222222225in"}

Provide a name, code, parent code (for sub-requirements), description, condition (must/should) and source(s). All fields except parent code are mandatory. If you leave some field empty, the system will return an error. Name and Code are unique values, so they can't be repeated. If you want to create a sub-requirement via file upload, please specify parent code (id) in the corresponding column. Condition field is a dropdown, so you can select value from the list. If case you want to add several sources for one requirement you can provide comma separated values.

This is an example of the populated table:

![A screenshot of a computer AI-generated content may be incorrect.](media/image132.png){width="7.9in" height="4.647222222222222in"}

Once the file is ready, save changes and upload it to PICASso using 'Import XSLX' button on the Product Requirements tab.

![A screenshot of a computer AI-generated content may be incorrect.](media/image133.png){width="7.9in" height="3.8694444444444445in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image134.png){width="7.9in" height="3.873611111111111in"}

If the template has errors, it would be shown under 'Import XSLX' button. Clicking 'Errors' link opens a pop-up with the list of errors and specifying what line contains error:

![A screenshot of a computer AI-generated content may be incorrect.](media/image135.png){width="7.9in" height="3.8944444444444444in"}

In case of successful upload the requirements will be created and appear in the list.![A screenshot of a computer AI-generated content may be incorrect.](media/image136.png){width="7.9in" height="3.863888888888889in"}

Number of custom requirements is displayed at the bottom of the page:

![A screenshot of a computer AI-generated content may be incorrect.](media/image137.png){width="7.9in" height="3.8305555555555557in"}

It is possible to remove custom requirements if it is no longer needed. To do so, click 'Three dots' icon in the Actions column, then click 'Remove'. In the opened pop-up provide mandatory rationale for removal.

![A screenshot of a computer AI-generated content may be incorrect.](media/image138.png){width="7.9in" height="3.8201388888888888in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image139.png){width="7.9in" height="3.7527777777777778in"}

The status of removed requirement will be changed to 'Not Selected' and it will be hidden. To see the requirements with 'Not Selected' status enable 'Show all requirements' toggle button. You can also add removed requirement back using 'Add' button in the Actions column and providing rationale for adding (optional).

To remove custom requirements or add removed ones use checkboxes to select them and 'Add' and 'Remove' buttons in Bulk Actions section.

![A screenshot of a computer AI-generated content may be incorrect.](media/image140.png){width="7.9in" height="3.8513888888888888in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image141.png){width="7.9in" height="3.7958333333333334in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image142.png){width="7.9in" height="3.842361111111111in"}

**Custom Requirements Handling**

Custom requirements are managed like other requirements:

-   Can be sent to Jira/Jama on the Manage stage

-   Status, evidence link and justification can be updated (manually, in bulk, via file upload)

-   Included in the Export XLSX file.

-   If the release is cloned, custom requirements are cloned as well.

-   Fields for custom requirements are added to GetReleaseProductRequirements Data Extraction API method.

-   Adding/Updating/Removal of custom requirements is logged in the release history under 'Requirement Status Update' activity.

![A screenshot of a computer AI-generated content may be incorrect.](media/image143.png){width="7.9in" height="6.083333333333333in"}

##### Onboarding Release

If you are moving your existing product to PICASso and already follow SDL/FCSR process you should onboard your product through the release.

###### Release Details

If the product is an existing product, use the steps below for the workflow. These are the same things you would use for a new product release.

![](media/image144.png){width="7.90625in" height="3.7708333333333335in"}

The only additional step will be to provide the dates of the \'Last Full Pen Test Date\' and the \'Last BU Security Officer FCSR Date\' (mandatory field), as indicated above. 'Last Full Pen Test Date' field is optional. When clicking on 'Create&Scope' button, if you haven't provided this date, the system will show a warning:

![](media/image145.png){width="7.90625in" height="5.947916666666667in"}You will be able to provide Last Full Pen Test details later, on the 'Manage' stage on the Cybersecurity residual risks tab in the 'Security defects' section.

![A screenshot of a computer Description automatically generated](media/image146.png){width="7.06444772528434in" height="3.4166666666666665in"}

Fill in the 'Change Summary' field and click 'Submit'.

##### Release Created Based on Other Release (Сlone Release)

Each release is a product evolution and is based on the code of the previous release. To keep track of already implemented requirements and yet to be implemented the inheritance feature is implemented in PICASso. To leverage the benefits of using this functionality the user should follow the steps outlined in the sections below.

1.  Go to "Product" from "My Products" tab on the Home page.

2.  Open "Releases" tab on the "Product" form.

3.  Choose the release from the list you want to use as a basis for new release

4.  Click on "Clone" button in the Actions column

![](media/image147.png){width="7.90625in" height="3.8020833333333335in"}

5.  Enter the release details in the popup window:

![](media/image148.png){width="7.90625in" height="3.90625in"}

6.  When the data is entered and saved a new release is created.

7.  Open the newly created release and check that the following data is copied from the referenced release:

    a)  **Release details tab**: Continuous Pen Test Contract Date, Last Full Pen Test Date, Last BU Security Officer FCSR Date

![](media/image149.png){width="7.90625in" height="3.9270833333333335in"}

b)  **Roles & Responsibilities**: Product Team table

c)  **Questionnaire**: all the answers that were given in the previous release.

System Behavior with Updated Questionnaires:

If new or updated questions exist within the questionnaire:

> 1.1. A warning icon will be displayed.
>
> 1.2. Users must review and respond to all new or updated questions.
>
> 1.3. After questionnaire re-submission the system will regenerate and display new Process and Product Requirements. Previously implemented process requirements will remain in 'Done' status and will be shown in the list. Product requirements done in previous releases will be hidden, but you can view them using 'Show All Requirements' toggle button. Such requirements will have 'On a previous release' label.

d)  **Process/Product Requirements**:

> Copied data: All requirements and sub-requirements regardless of their status. Evidence links, justification and source links (if managed in Jira/Jama) will be copied too.

e)  **Review&Confirm tab:** -- no data is copied to the cloned release.

f)  **Cybersecurity Residual Risks:**

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Section**                       **Copied Data**                                                               **Excluded Data**
  --------------------------------- ----------------------------------------------------------------------------- --------------------------------------------------------------------
  SDL Processes Summary             Evaluation Statuses of the requirements                                       SDL Details, actions and Residual Risk

  Product Requirements Summary      Evaluation Statuses of the requirements                                       Cybersecurity Requirements Roadmap link, actions and Residual Risk

  System Design                     System Design Information, Components, Countermeasures, Residual Risk         Actions

  Threat Model                      All information (including links and residual risk)                           Actions

  3^rd^ Party Suppliers&SE Bricks   TPS Products, SE Bricks, Libraries, Libraries, and Platforms, Residual Risk   Actions

  Static Code Analysis              SCA Tools, Residual Risk                                                      Actions

  Software Composition Analysis     SCA Tools, Residual Risk                                                      Actions

  FOSS Check                        All information                                                               Actions

  Security Defects                  SVV Test Issues, Pen Test Details, Residual Risk                              Actions

  External Vulnerabilities          External Vulnerability Issues, Residual Risk                                  Actions
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**FCSR Review Tab: No data is copied**.

**Validation and Rules for Cloning**

-   Release Version:

    -   Must be unique (cannot replicate the name of an existing release)

-   Target Release Date:

    -   Past dates cannot be selected.

-   Change Summary:

    -   Optional free-text field to provide additional context about the cloned release.

5\. Post-Cloning Actions

After cloning a release:

1.  Warning for Updated Questionnaires:

    -   If the Questionnaire includes new or updated questions, users must review and respond to them before proceeding.

    -   Process and Product Requirements together with Risk Classification and Data Protection and Privacy Risk will be updated automatically based on the new responses. Risks can also be updated manually at the Review&Confirm stage by Scope Approver.

2.  View the Cloned Release:

    -   The cloned release is visible on 'My Releases' tab of the product.

3.  Complete Missing Data:

    -   Users should update any required fields, actions, or information not carried over during the cloning process.

###### Last Full Pen Test Date and Last BU Security Officer FCSR Date Cloning Behavior

If these fields were populated in the first (onboarding) release, they will be updated in the following cases:

-   If the full pen test was performed as part of source release, the new date must be specified in the Security Defects Section of CSRR tab. Once the release is cloned, this date will be populated in the release details of the cloned release.

![A screenshot of a computer AI-generated content may be incorrect.](media/image150.png){width="7.9in" height="3.816666666666667in"}

-   If full pen test wasn't performed as part of the source release, then the date specified in the release details will be copied to the cloned release.

-   If in the initial release FCSR was performed by BU Security Officer, the date of FCSR completion will be populated in the cloned release.

-   If in the initial release FCSR was performed by SA or LOB Security Leader, then Last BU Security Officer FCSR Date will be copied to the cloned release as specified in the release details of initial release.

-   If these fields were empty in the initial release, the above described logic will be applied as well.

##### Release Submit for Review

Once the user has completed work on the questionnaire, reviewed and decided on the process and product requirements for inclusion in this release, they can submit the release for review. This is done by the Product Owner/Security Manager and can be submitted by clicking on the \'Submit for Review\' button.

![A screenshot of a computer AI-generated content may be incorrect.](media/image151.png){width="7.9in" height="3.8881944444444443in"}

Upon successful submission, a notification will be displayed at the top of the screen. The release status and the stage of the release workflow will also be updated accordingly.

![A screenshot of a computer AI-generated content may be incorrect.](media/image152.png){width="7.9in" height="3.811111111111111in"}

The task "Review and Confirm" will be created and added to the "My Tasks" list for the individual who is in charge of doing it according to the routing logic rules.

![A screenshot of a computer Description automatically generated](media/image153.png){width="6.69375in" height="1.4847222222222223in"}

#### Review & Confirm

The Security Advisor, LOB Security Leader, or BU Security Officer will get an email notification about the new release submitted for scope review and confirmation. They can get to the PICASso release form from the email clicking on the release link or login to PICASso and either:

1)  Open "My Releases" tab filter by status equal to "Scope Approval"

![A screenshot of a computer Description automatically generated](media/image154.png){width="6.69375in" height="1.5152777777777777in"}

2)  Go to "My Tasks" and filter by Name equal to "Review and Confirm"

![A screenshot of a computer Description automatically generated](media/image155.png){width="6.69375in" height="1.711111111111111in"}

As a reviewer, the user can execute all actions that were available in the previous stage of the workflow. They can:

1)  Change the requirements status and provide comments.

![A screenshot of a computer Description automatically generated](media/image156.png){width="6.885001093613298in" height="3.375in"}

2)  Add new requirements from the list

![A screenshot of a computer Description automatically generated](media/image157.png){width="6.875in" height="3.343885608048994in"}

3)  Correct the answers in the questionnaires.

4)  Change the Privacy Risk and Risk Classification. It is mandatory to provide a justification for updating these fields.

**NOTE!!!** Any changes in the questionnaire will trigger the recalculation of the requirements. If the risk classification was changed, the approver will be changed as well. For example, Minimum Oversight Level of the product is 'Team' and calculated risk is 'Major'. If the Scope Reviewer changes the risk to 'Minor', the approver will be changed to LOB Security Leader.

![A screenshot of a computer Description automatically generated](media/image158.png){width="6.1625229658792655in" height="2.9791666666666665in"}

![A screenshot of a computer Description automatically generated](media/image159.png){width="6.018066491688539in" height="2.4068514873140856in"}

5)  Review aggregated information about requirements and previous FCSR&PCC decisions, give scope review participant's recommendations and/or actions if needed, store details about key discussion topics, and provide Scope Review Decision on the Review & Confirm tab.

![](media/image160.png){width="7.90625in" height="4.177083333333333in"}![](media/image161.png){width="7.90625in" height="3.90625in"}![](media/image162.png){width="7.90625in" height="2.8958333333333335in"}

After completing the review, the user should click on the \'Submit\' button. This will officially move the release advancing it to the next stage. The task will be created for Product Owner and Security Manager. An email notification will also be sent to the relevant group of individuals.

![A screenshot of a computer Description automatically generated](media/image163.png){width="6.208333333333333in" height="3.0043602362204727in"}

It is possible to send the release to rework if needed. To do so, click on 'Rework' button and provide a justification in the opened pop-up:

![A screenshot of a computer AI-generated content may be incorrect.](media/image164.png){width="7.9in" height="3.8375in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image165.png){width="7.9in" height="3.8208333333333333in"}

#### Manage

Once the release scope is approved, Product Owner and Security Manager will get a notification by email and can get to the release right from email body by clicking on the link with a release number or opening a task in the "My Tasks" list. The main goal is to update statuses of the requirements and provide evidence during the release, filling the data in the cybersecurity residual risks tab, and at the end of the stage when it is ready for SA&PQL sign off and FCSR from a product development team perspective, enter a product manager and/or security manager recommendation on FCSR decision. If the product team sees any action required, they can create them. Below you can find detailed instructions on how to fill the necessary sections.

##### Process & Product Requirements Manual Update

If product development is not tracked in Jira the user should manually update the statuses of the product and process requirement tabs and provide links to the place where the evidence is stored.

You can update either:

1)  Each requirement by clicking on "Edit" button in the row and filling the "Status", "Evidence Link", and "Justification" fields.

![A screenshot of a computer AI-generated content may be incorrect.](media/image166.png){width="7.9in" height="3.877083333333333in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image167.png){width="7.9in" height="3.8534722222222224in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image168.png){width="7.9in" height="3.8333333333333335in"}

2)  Select multiple requirements and click on 'Edit selected requirements' button (in the same way as on the Creation&Scoping stage).

> ![A screenshot of a computer AI-generated content may be incorrect.](media/image169.png){width="7.9in" height="3.80625in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image170.png){width="7.9in" height="3.872916666666667in"}

##### Process & Product Requirements Bulk Update

1.  Export a file containing all the scoped requirements by clicking on 'Export XLSX'.

![](media/image171.png){width="7.90625in" height="3.8020833333333335in"}

2.  Make changes in the file (update Status, Evidence, Justification), save changes.

Status should be selected from the dropdown:

![](media/image172.png){width="7.824009186351706in" height="3.9901399825021873in"}

Evidence field must be filled in if the status is 'Done' or 'Partial'.

Justification must be provided if the status is 'Done', Postponed', 'Not Applicable', 'Delegated'.

![](media/image173.png){width="7.90625in" height="5.09375in"}

3.  Upload the file back using 'Import XSLX' button.

![](media/image174.png){width="7.90625in" height="3.84375in"}4. Important notes:

Do not remove/reorder tab (Instructions and Data tabs should be left as is).

Do not change the order or remove the columns.

If you make changes to the columns other than Status, Evidence, Justification, these changed won't be taken into account.

For the products managed in Jira, you will see additional 'Source Link' column on the 'Data' tab. If the requirement is managed in Jira (Source Link is populated), do not change the status, evidence or justification, it won't be taken into account. The status of such requirements can be changed ONLY in Jira.

##### 2.6.4.2.1. Process & Product Requirements Submit to JIRA

If the requirements are tracked in Jira and Jira connection settings are provided for this product in PICASso (see section [New Product Creation)](#new-product-creation) the user will be able to send Process & Product requirements on the "Manage" stage to Jira by clicking on "Submit to Jira" button.

Before submitting requirements to Jira, a person that manages project in Jira (it can be Product Owner or Security Manager), should grant 'Administrators' role for the user 'PICASso Jira'.

To do so, go to Jira, click on 'Gear' icon -- Projects.

![](media/image175.png){width="7.90625in" height="0.8854166666666666in"}Open your project:

![](media/image176.png){width="7.90625in" height="3.8229166666666665in"}

Scroll down, click on 'Users and Roles':

![](media/image177.png){width="7.90625in" height="3.8125in"}

Click on 'Add users to a role':

![](media/image178.png){width="7.90625in" height="2.2916666666666665in"}

Search for a user 'PICASso Jira', click on it and add role 'Administrators' from the dropdown list in the 'Role' field. Click 'Add'.

![](media/image179.png){width="7.90625in" height="2.3020833333333335in"}

Now you can submit requirements to Jira. Do not forget to configure status mapping to align Jira statuses with PICASso ones [(Status Mapping Configuration)](#status-mapping-configuration). Select the requirements you want to submit to Jira and click on 'Submit to Jira':\
![](media/image180.png){width="7.90625in" height="3.8645833333333335in"}

Note. Requirements in 'Done' status won't be sent to Jira.

The popup window will appear with the list of requirements you're submitting to Jira, click 'Submit':

![](media/image181.png){width="7.90625in" height="3.8125in"}In the pop-up there is an 'Include sub-requirements\' checkbox that is checked by default. If you do not want to include them, just uncheck the checkbox.

If you do selected only sub-requirement without their parents, parent requirements would be also added to the scope (if they have 'Not Selected' status) and the ticket to be created for them in Jira.

Once the corresponding Jira items are created in Jira the requirements will be updated to include links to Jira objects (Source Link column).

NOTE!!! The Structure will be as follows:

1)  The capability "SDL Process Requirements" and/or "Product Requirements" will be created in Jira;

2)  Each Process or Product Requirement will be created as a feature in Jira;

3)  Each sub-requirement will be created as a user story in Jira.

If the feature/user story for the requirement/sub-requirement already exists and new feature/user story won't be created.

![A screenshot of a computer Description automatically generated](media/image182.png){width="4.987949475065617in" height="2.5087226596675416in"}

When all Jira objects are created the work on them continues in Jira. If the status of the feature/user story is changed in Jira it will be synchronized with PICASso. The automatic update/synchronization happens once per day.

However, the user can request the latest updates. To do so, navigate to Process or Product requirements tabs and click on 'refresh data from Jira'. This step is to synchronize the status of Jira status on PICASso.

![](media/image183.png){width="7.90625in" height="3.8541666666666665in"}

Confirm this step by clicking on 'Refresh' button from the dialog box.

![](media/image184.png){width="7.90625in" height="3.84375in"}

After synchronization, all statuses and source links are updated accordingly.

![A screenshot of a computer Description automatically generated](media/image185.png){width="5.774721128608924in" height="2.132794181977253in"}

Note. If the requirement statuses are not updated after performing 'Refresh data from Jira' (and there are no errors on the UI), it might happen that the connection to Jira has been configured, but the status mapping configuration is missing. Please verify that the status mapping between Jira and PICASso is properly configured.

Once the requirements are submitted to Jira, users can click on the \'Source Link\' column\'s link to access the specific Jira ticket. The reporter for this ticket will be listed as PICASso Jira (SESI 018387).

![](media/image186.png){width="7.90625in" height="4.041666666666667in"}

The assignee could be populated automatically or manually added by the Product Owner. For process requirements detailed in the BackOffice, there is a field for an accountable role. If this field is populated, the Jira ticket will be assigned to the specified individual, who could be an architect, developer, pen tester, etc. If no accountable role is specified, the assignee must be manually assigned in Jira by the Product Owner or Security Manager.

For product requirements, the Jira tickets will be automatically assigned to the Product Owner.

There is also a possibility to unlink the requirements if you want to continue to work on them directly in PICASso. To unlink the requirement, select the requirement and click on 'Unlink' button:

![](media/image187.png){width="7.90625in" height="3.875in"}Once a button is clicked, a pop-up will appear where you can include sub-requirements to be unlinked and then confirm unlinking:

![](media/image188.png){width="7.90625in" height="3.7604166666666665in"}After confirmation, the requirement has been successfully unlinked from the Jira ticket.

![](media/image189.png){width="7.90625in" height="3.8020833333333335in"}In case there is a need to relink this requirement to the same ticket, select this requirement and click on 'Relink' button. Once clicked, a pop-up will be displayed with the date of unlinking and the ticket number in Jira. Click on 'Relink' again.

![](media/image190.png){width="7.90625in" height="3.84375in"}The requirement has been successfully relinked:

![](media/image191.png){width="7.90625in" height="3.84375in"}

##### 2.6.4.2.2. Product Requirements Submit to JAMA

If the product requirements are tracked in Jama and Jama Project ID is specified for this product in PICASso (see section New Product Creation) the user will be able to send Product requirements on the "Manage" stage to Jama by selecting specific requirements/sub-requirements and clicking on "Submit to Jama" button.

Before submitting requirements to Jama, a person that manages project in Jama (it can be Product Owner or Security Manager), should grant project administrator role for the service account (SRV001849) in Jama.

Also, the person submitting requirements to Jama from PICASso should have edit permissions for this Jama project. If this person does not have permissions to create requirements in this Jama project, an error would be shown in PICASso upon submission.

After these access permissions are verified and granted, this person can submit requirements to Jama.

Select the requirements you want to submit to Jama and click on the activated "Submit to Jama" button: ![A screenshot of a computer AI-generated content may be incorrect.](media/image192.jpg){width="7.9in" height="2.0931627296587925in"}

***Note:** 1) Requirements in statuses \"Postponed\", \"Not Applicable\" or \"Delegated\" can't be submitted to Jama.*\
*2) When the sub-requirement is selected and sent to Jama, the system should check if the parent requirement was already sent to Jama or not and if not -- send it together with these selected sub-requirements.*

The confirmation pop-up window will be opened with the list of requirements that would be submitted to Jama. Click on the 'Submit' button to confirm the submission and on Cancel or Close buttons to cancel the submission and close the pop-up:

![A screenshot of a computer AI-generated content may be incorrect.](media/image193.png){width="7.9in" height="4.212205818022747in"}

Upon clicking the \"Submit\" button, PICASso will send a request to create requirement object for these requirements in Jama using Orchestra tool as middle layer for such requests management. The requirements successfully received by Orchestra would be added to this Orchestra offer in the Requirements section:

![A screenshot of a computer AI-generated content may be incorrect.](media/image194.jpg){width="7.9in" height="4.0175218722659665in"}

***Note:** 1) Offer in the Orchestra platform does not have to be created before hand - as it would be created automatically upon submission of the 1st portion of requirements from PICASso to Jama.*

*2) If the offer in Orchestra already created for your PICASso product, it would be linked to PICASso product only if it is already linked to the corresponding Jama project. So, if your Orchestra offer is already available, but not yet linked to Jama project -- create a request to Orchestra team to link this offer to the desired Jama project.*

If the submission from Orchestra to Jama is successful, when the confirmation of created requirement is received from Jama, link to Jama ticket and Source Status in Jama is added for this requirement and PICASso status is updated based on the **Status Mapping** configured for this product: ![A screenshot of a computer AI-generated content may be incorrect.](media/image195.jpg){width="7.9in" height="2.6333333333333333in"}

If the submission was not successful, the corresponding error with description would be displayed in PICASso for these submitted requirements: ![A screenshot of a computer AI-generated content may be incorrect.](media/image196.jpg){width="7.9in" height="2.498290682414698in"}

As soon as Orchestra platform transfer request for the requirements objects creation to Jama, the corresponding requirements would be created in Jama under Customer level -\> Cybersecurity Requirements with sub-requirements linked to their requirements. ![A screenshot of a computer AI-generated content may be incorrect.](media/image197.jpg){width="7.9in" height="2.8021369203849518in"}

If the requirement object in Jama already exists - new object won't be created, but existing one would be updated to match the PICASso library in description, name, must or should value and linkage to the parent.

When all Jama objects are created the work on them continues in Jama. If the status of the Jama requirement object is changed in Jama it will be synchronized with PICASso. The automatic update/synchronization happens once per day - 00:01 UTC).

However, the user can request the latest updates manually. To do so, navigate to Product requirements tab and click on "Refresh data from Jama". This step is to synchronize the status of Jama object status to PICASso. ![A screenshot of a computer AI-generated content may be incorrect.](media/image198.jpg){width="7.9in" height="1.8568372703412073in"}

Confirm this step by clicking on 'Refresh' button from the dialog box.

After synchronization, all statuses and source links are updated accordingly. ![A screenshot of a computer AI-generated content may be incorrect.](media/image195.jpg){width="7.9in" height="2.6333333333333333in"}

Once the requirements are submitted to Jama, users can click on the \'Source Link\' column\'s link to access the specific Jama object. The reporter for this ticket will be listed as Jama Service account.

For product requirements, the Jama tickets would be automatically assigned to the Product Owner specified for this product in PICASso.

The records submitted to Jama cannot be manually updated in PICASso. Only when user unlinks requirements from Jama, the user can change the requirement status manually or submit the requirement to Jama again. ![A screenshot of a computer AI-generated content may be incorrect.](media/image199.jpg){width="7.9in" height="2.4138888888888888in"}

After confirmation, the requirement has been successfully unlinked from the Jama ticket and now requirement can be updated manually from PICASso.

![A screenshot of a computer AI-generated content may be incorrect.](media/image200.png){width="7.9in" height="3.520469160104987in"}

In case Jama object was unlinked by mistake, this action can be reverted by clicking \"Relink\" button for the requirement. Upon clicking -- the requirement would be relinked to the previously linked Jama ticket: ![A screenshot of a computer AI-generated content may be incorrect.](media/image201.jpg){width="7.9in" height="2.582692475940507in"}

The requirement has been successfully relinked:

![A screenshot of a computer AI-generated content may be incorrect.](media/image202.png){width="7.9in" height="3.32542760279965in"}

For all the requirements submitted Jama, data on the requirements preview pop-up would be updated and would show the following fields with respective data:

+-----------------------------------+-----------------------------------------------------------------------------------------------+
| **Field Name**                    | **Data Description**                                                                          |
+===================================+===============================================================================================+
| Requirement Name                  | Name of the Product Requirement in PICASso                                                    |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Requirement Description           | Description of the Product Requirement in PICASso                                             |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Rationale for Adding Requirements | Contains text specified as the rationale for adding requirements to release                   |
|                                   |                                                                                               |
|                                   | Note: Shown only when requirement was added manually to release and not scopped automatically |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Status                            | Requirement completion status from PICASso                                                    |
|                                   |                                                                                               |
|                                   | Note: defined based on the Status Mapping configured on the Product Details                   |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Backlog Link                      | Link to the linked Jama item                                                                  |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Last Test Execution               | Link to the last test execution from Jama                                                     |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Verification Status               | Verification status of the last test execution from Jama                                      |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| Updated by                        | User who has updated requirement last time in Jama                                            |
+-----------------------------------+-----------------------------------------------------------------------------------------------+
| on                                | Date when requirement was updated last time in Jama                                           |
+-----------------------------------+-----------------------------------------------------------------------------------------------+

![](media/image203.png){width="7.9in" height="3.2579057305336834in"}

##### Cybersecurity Residual Risks

To access residual risks data, navigate to the \'Cybersecurity Residual Risks\' tab, which is next to the "Review&Confirm' tab. By default, the SDL Process Summary page will be displayed. Use the left-hand side tabs to navigate and access information about the SDL Processes Summary, Product Requirement Summary, Threat Model, 3rd Party Suppliers&SE Bricks, among others. The Residual Risk value can also be viewed within the same section. Each section has instructions with the list of activities that should be performed in this section:

![A screenshot of a computer AI-generated content may be incorrect.](media/image204.png){width="7.9in" height="3.8201388888888888in"}

![A screenshot of a computer Description automatically generated](media/image205.png){width="6.461543088363954in" height="2.5962806211723533in"}

###### SDL Processes Summary

In this section, we examine the remaining gaps in the process. During the planning of the development of this release, SDL Process Scoping activities identified a number of SDL Practice Requirements that were required to be completed during the development for this release.

SDL Processes Summary section reflects the SDL Details, Process Requirements List, Residual Risk evaluation, and Action items list.

![A screenshot of a computer AI-generated content may be incorrect.](media/image206.png){width="7.9in" height="3.825in"}

![](media/image207.png){width="6.69375in" height="0.8076388888888889in"}

Use the arrow keys to hide content whenever required.

To make any changes click on "Edit" button at the bottom right corner of the page and do not forget to save changes by pushing "Save" button. If changes are not saved, and you go to another section, a warning will appear with the options to save changes, go to another section without saving, or stay in this section. All data in the 'Edit' mode is saved automatically every 1 minute. But to be able to move to the next stage you should save all the changes manually.

In the 'SDL Details' sub-section there is 'SBOM Status' field, that was recently added. It is a dropdown list with three options: Submitted, In Progress and N/A. If 'Submitted' or 'In Progress' is selected, additional field 'SBOM ID' will appear. If 'N/A' is selected, you must provide justification. Additionally, there are several validations for these fields:

1.  At the 'SA&PQL Sign Off'/Security and Privacy Readiness Sign Off stage: if the SBOM status is \'Submitted\', the SBOM ID must be provided.

2.  At the 'Final Acceptance' stage: SBOM Status and SBOM ID cannot be empty; if SBOM status is 'In Progress', SBOM ID must be provided before release completion.

In this section you should also add SDL Artifacts Repository link and specify if there is any SDL gap found:

![A screenshot of a computer AI-generated content may be incorrect.](media/image208.png){width="7.9in" height="3.8222222222222224in"}

Evaluation statuses for the process requirements and risk classification will be provided by responsible individuals at the SA&PQL Sign Off stage. At 'Manage' stage you can use 'ADD Action' tab to list action items and save your entries.

![A screenshot of a computer Description automatically generated](media/image209.png){width="6.689583333333333in" height="3.2270833333333333in"}

###### Product Requirements Summary

This section is designed and behave exactly the same way as "SDL Processes Summary". What you need to do here is to provide Cybersecurity Roadmap link and add actions if needed.

![A screenshot of a computer Description automatically generated](media/image210.png){width="6.69375in" height="2.730456036745407in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image211.png){width="7.9in" height="3.89375in"}

Here you can also see the percentage of applicable, expected and essential requirements that were implemented during the release:

Percentage of all applicable CS requirements that were implemented is count based on the formula: Count of all Product Requirements applicable for the Product with status "Fully met" across all releases divided by count of all Product Requirements applicable for the Product across release chain including postponed.

Formula for the percentage of all expected CS requirements implemented: Count of all Product Requirements applicable for the Product in the current release with status "Fully met" divided by count of all Product Requirements applicable for the Product in the current release.

Percentage of all essential CS requirements implemented is calculated based on the formula: all requirement with an evaluation status 'Fully met' divided into all requirements with 'Source' status is equal to 'Essential'.

###### System Design

This section captures important design information for a system offer that will support the FCSR.

1\. Provide a link to system architecture document and/or to the diagram that shows the zones and conduits, and how they are secured.

2\. List all the components utilized in the system.

3\. List all the compensating countermeasures and the security risks they mitigate, with confirmation they are in-place in the system for the targeted security level.

4\. Add action plan proposals if required to address residual risk posed by the system design. This section appears only in case the "Product Definition" is equal to "System".

![A screenshot of a computer Description automatically generated](media/image212.png){width="6.69375in" height="3.145138888888889in"}

To input the System Design details, click the \'Edit\' button located at the bottom right of the page.

![A screenshot of a computer Description automatically generated](media/image213.png){width="6.69375in" height="3.1319444444444446in"}

If in the 'Reference to Schneider Electric' section of the Release Details tab you have added Included SE Components with any product type except of SE Bricks/Library/Platform type, they will be added as components to the System Design section automatically.

To add new component, click on 'Add component' button and provide all the information as mentioned below. You can either select the product existing in PICASso or create new component:

![A screenshot of a computer AI-generated content may be incorrect.](media/image214.png){width="7.9in" height="3.797222222222222in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image215.png){width="7.9in" height="3.8409722222222222in"}

To add new countermeasure, click 'Add Countermeasure' button and provide all necessary information:

![A screenshot of a computer AI-generated content may be incorrect.](media/image216.png){width="7.9in" height="3.8618055555555557in"}

You can add several countermeasures by clicking 'Add Countermeasure' button multiple times. It is also possible to remove added countermeasures by clicking 'Bin' icon:

![A screenshot of a computer AI-generated content may be incorrect.](media/image217.png){width="7.9in" height="3.8430555555555554in"}

Add actions if needed:

![A screenshot of a computer AI-generated content may be incorrect.](media/image218.png){width="7.9in" height="3.8506944444444446in"}

###### Threat Model

Threats that have not been investigated or mitigated are a source of cybersecurity risks. The residual risk rating of the Threat Model is to be classified based upon the combination of the severity (CVSS) and status of threats which are still to be investigated or mitigated.

NOTE: Threat Models and results should be protected as company confidential.

1\. Complete the Threat Model information details (Link to Threat Model is mandatory field)

2\. Provide the number of threats in each of the Severity / Status categories

3\. Populate the table of mitigations still to be implemented

4\. Populate the table of Threats that have been \'Accepted\'

5\. Classify the overall level of residual cybersecurity risk due to not investigated, unmitigated, or accepted threats

6\. Add action plan proposals if required to address gaps in the Threat Model

![A screenshot of a computer AI-generated content may be incorrect.](media/image219.png){width="7.9in" height="2.240972222222222in"}

By clicking on the "+Add Threat Mitigation" and "+Add Accepted Threats" new records in the tables are added.

###### 3^rd^ Party Suppliers & SE Bricks

Cybersecurity vulnerabilities can enter products from development outside of Schneider. Schneider can inherit security risks from third-party products that it brand-labels, or when there is custom component developed for Schneider from a third-party supplier (TPS). Note that even when development is completed externally, Schneider and its project teams are responsible for managing what has contributed to the security of its products. In addition, vulnerabilities can arise due to the integration of SE Bricks / libraries which themselves contain vulnerabilities; or in the case of Bricks which are at \'end-of-support\', the product development is responsible for the brick.

In this section you need to provide TPS Products and SE Bricks/Libraries/Platforms of this product.

To add a TPS Product, click on the corresponding button and provide all the details: Name, Type, TPS Name, IRA rating, etc.:

![A screenshot of a computer AI-generated content may be incorrect.](media/image220.png){width="7.9in" height="3.888888888888889in"}

If any Bricks/Libraries/Platforms were added as included SE Components on the release details tab, it will be automatically added to the 'SE Bricks/Libraries/Platforms' chapter. To add new record, click on 'Add SE Brick/Library/Platform' button and fill out the details. Similarly to System Design section, you can either add a product that already exists in PICASso or add completely new record.

![A screenshot of a computer AI-generated content may be incorrect.](media/image221.png){width="7.9in" height="3.5256944444444445in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image222.png){width="7.9in" height="3.470833333333333in"}

Once the product is added here, it will be reflected on the release details in the Included SE Components tab.

At any point of time, you can remove the record by clicking on the bin icon next to the TPS Product or SE Brick/Library/Platform record.

![A screenshot of a computer AI-generated content may be incorrect.](media/image223.png){width="7.9in" height="3.865972222222222in"}

###### Static Code Analysis

In this section you need to add SAST tools that are used. It can be Coverity, Fortify, Klockwork or any other tool:

![A screenshot of a computer AI-generated content may be incorrect.](media/image224.png){width="7.9in" height="3.8631944444444444in"}

Select a Static code analysis tool from the drop-down field and then click on "Add Tool" button appeared next to the drop-down.

If the tool used in the product SDL isn\'t listed, please select the \'Other\' option and input the name of the tool in the field that appears. Afterward, click the \'+Add Tool\' button.

![A screenshot of a computer Description automatically generated](media/image225.png){width="6.680555555555555in" height="3.1180555555555554in"}

Once you have added the tool, fill out all the details as mentioned below:

![A screenshot of a computer AI-generated content may be incorrect.](media/image226.png){width="7.9in" height="3.8569444444444443in"}

Add actions and save changes before moving to the next section.

###### Software Composition Analysis 

In this section you need to select Software Composition Analysis tool and list third party components with unmitigated vulnerabilities.

![A screenshot of a computer AI-generated content may be incorrect.](media/image227.png){width="7.9in" height="3.8881944444444443in"}

Select a Software Composition Analysis tool from the drop-down field and then click on "Add Software" button appearing next to the drop-down.

![A screenshot of a computer Description automatically generated](media/image228.png){width="6.69375in" height="2.745833333333333in"}

Once the tool is selected, provide the following details:

![A screenshot of a computer AI-generated content may be incorrect.](media/image229.png){width="7.9in" height="2.439583333333333in"}

Then provide the details for third party components with unmitigated vulnerabilities. To add new record, click on 'Add line' button.

![A screenshot of a computer Description automatically generated](media/image230.png){width="6.69375in" height="2.9791666666666665in"}

Add actions if needed and save changes.

###### FOSS Check

In this section you need to provide free&open source software licensing details: provide answers to the questions and add comments if needed.

If answer to the first question 'Does the product contain any FOSS?' is 'Yes, then you must provide Open Source& Licensing Offer Information link:

![A screenshot of a computer AI-generated content may be incorrect.](media/image231.png){width="7.9in" height="3.9305555555555554in"}

###### Security Defects 

Verification and Validation (V&V) security testing by the project team can discover potential vulnerabilities. Every project is required to complete their own security testing before submission to a separate independent pen-test team with all test failures tracked via internal backlog or defect tracking tools. For Systems, countermeasure validation must be included in the V&V plan and confirmed they work as designed., any unmitigated risks or vulnerabilities discovered from the V&V testing for the countermeasures should be listed along with any unresolved security risks or outstanding vulnerabilities from third-party devices.

Pen testing by an independent team is part of the SDL process. The objective of this section is to identify remaining issues discovered by a Pen Test team. For systems, there should be a review of the system pen-test and any individual component pen-test results with applicable vulnerabilities being listed in the following tables.

In this section:

1\. List the remaining SVV Test issues still to be fixed / mitigated, and specify a target release when a fix / mitigation is to be implemented. Select the source of the issue (V&V Testing, Pen Testing, External) and severity. Add link to Jira case if needed.

2\. Complete the Pen Test details: pen test type, Internal SRD Number or Vendor reference number, who performed testing. Number of Critical/High/Medium/Low severity issues will calculated automatically, based on the answers provided in the SVV Test Issues section (with source - Pen Testing)

3\. Add action plan proposals if required to address SVV Test issues

Click on "+Add SVV Issue" button to add the record and provide SVV Issue title, source (whether it was found during V&V testing, pen testing or external testing), add link to backlog item, select severity and target release for the fix:

![A screenshot of a computer AI-generated content may be incorrect.](media/image232.png){width="7.9in" height="3.8222222222222224in"}

Once you list SVV test issues you can filter it by source or severity

![A screenshot of a computer AI-generated content may be incorrect.](media/image233.png){width="7.9in" height="2.74375in"}

Then provide penetration testing details. First of all, answer the question if pen test was performed as part of this release. Then, depending on the answer, provide a justification if the test wasn't performed, delegated or it's not applicable for the release, or provide pen details if it was performed:

![A screenshot of a computer AI-generated content may be incorrect.](media/image234.png){width="7.9in" height="3.8666666666666667in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image235.png){width="7.9in" height="3.8381944444444445in"}

Please note that pen test type and internal SRD number are mandatory fields. Pen test date is mandatory if the pen test type is 'Full'.

The number of remaining issues will be populated automatically from the SVV Test Issues section.

Additionally, there is a validation that Pen Test Details should be populated before FCSR Review.

Add actions if needed and save changes before moving to the next section.

###### External Vulnerabilities

External vulnerabilities are reported by individuals outside of Schneider (researchers, customers, etc.). External vulnerabilities are managed via a specific process and stored in a JIRA database. The status of these externally reported vulnerabilities must be considered during the FCSR.

1\. List remaining external vulnerabilities, their source, severity, and the target release for the fix / mitigation

2\. Add action plan proposals if required to address external vulnerabilities

Click on "+Add Issue" button to add the record and fill out the details: External Vulnerability Name, Source, Backlog link, severity and target release for fix. Similarly to Security Defects sections, once the issues are listed, you can filter them by source and severity.

![A screenshot of a computer AI-generated content may be incorrect.](media/image236.png){width="7.9in" height="3.8291666666666666in"}

#### FCSR Recommendation

Once the release artifacts are collected, all process and product requirements are fulfilled, as well as action items and cybersecurity residual risk details, the product owner and/or security manager should provide their recommendation on release readiness to go live.

![A screenshot of a computer Description automatically generated](media/image237.png){width="6.895833333333333in" height="3.4048884514435698in"}

To do so, navigate to the 'FCSR Decision' tab and click on the 'Edit' button at the bottom right corner.

Then click on "+Add Participant" and select the name from the FCSR participants list and choose the FCSR Decision recommendation. The recommendation should be chosen from the list: No-Go, Go with Pre-Conditions, Go with Post-Conditions, Go. FCSR participant should also type the comments in the box.

![A screenshot of a computer Description automatically generated](media/image238.png){width="6.697915573053368in" height="1.78125in"}

In case "GO with Post-Condition" or "GO with Pre-Condition" recommendation is selected at least one action item of "Post-Condition" or "Pre-condition" category must be added.

To add the action, scroll down and select \'+Add action\'. Fill in the necessary details which include: the Action Name, the Action State (options include Open, In Progress, On-Hold, etc.) and the Category (which can be Pre-Condition, Post-Condition or Tracked). Set a due date for this action by selecting a date in the \'Due Date\' field. Add a description in the provided \'Description\' field and add any corresponding evidence. Once all the information is filled in, ensure you click \'Save\' to keep your changes. There is also an option to delete the action after saving.

![A screenshot of a computer Description automatically generated](media/image239.png){width="6.697915573053368in" height="2.34375in"}

After the action is created, it is an option to submit it to Jira. To do this, select the action and click on the 'Submit Actions to Jira' button. The context window will appear, click 'Submit'.

![A white background with text Description automatically generated](media/image240.png){width="6.697915573053368in" height="1.8541666666666667in"}

If a recommendation isn't provided, the system will show a warning and it isn't possible to move to the next stage without a recommendation.

#### Release **Submit for SA & PQL Sign Off**

When all tabs are completed, and the release is ready for review click on "Submit for SA & PQL" button.

![A screenshot of a computer Description automatically generated](media/image241.png){width="6.689583333333333in" height="1.4847222222222223in"}

The message will appear at the top of the screen and the status of the release will be changed.

![A screenshot of a computer Description automatically generated](media/image242.png){width="6.689583333333333in" height="1.4375in"}

#### SA & PQL Sign Off

Both Security Advisor (or responsible for FCSR readiness review according to the routing rules) and Process Quality Leader (PQL) will get their task in the "My Tasks" list.

All actions described in the Manage stage are available to them except Jira submission. Their responsibility is to review all the data provided by the team, correct if needed, evaluate process and product requirements completeness, classify residual risks in each section of Cybersecurity Residual Risks tab, and add actions if needed.

**Note!** In the requirements section, there are two columns: \'Status\' and \'Evaluation Status\'. The \'Status\' column reflects statuses from Process and Product requirements tabs, while the \'Evaluation Status\' column should be completed by Security Advisor and/or Process Quality Leader within SDL Processes Summary and Product Requirements Summary sections of the Cybersecurity Residual Risks tab.

In the \'**SDL Processes Summary**\' tab, there are two automatically calculated fields: \'Total number of Applicable SDL Practice Requirements for Release (excluding sub-requirements)\' and \'Total number of Completed SDL Practice Requirements for Release (excluding sub-requirements)\'.

![A screenshot of a computer Description automatically generated](media/image243.png){width="6.697222222222222in" height="2.2809776902887138in"}

The \'*Total number of Applicable SDL Practice Requirements for Release (excluding sub-requirements)*\' is derived automatically from the \'Status\' column in the \'Requirements\' section using the following formula: Count of all Product Requirements for the Product in the current release with status "Done" divided by count of all Product Requirements for the Product in the current release.

Similarly, the field \'*Total number of Completed SDL Practice Requirements for Release (excluding sub-requirements)*\' uses the following calculation: Count of all Product Requirements applicable for the Product in the current release with status "Fully met" divided by count of all Product Requirements applicable for the Product in the current release.

SA and PQL should review all the requirements and accordingly, adjust the evaluation status. Available options for the \'Evaluation Status\' field are: Not evaluated, Not met, Partially met and Fully met.

In the \'**Product Requirement Summary**\' tab there are two auto calculated fields: \'What percentage of all applicable CS requirements for the product have been implemented thus far?\' and What percentage of all expected CS requirements for this release (as per roadmap) have been implemented?

![A screenshot of a computer Description automatically generated](media/image244.png){width="6.697915573053368in" height="2.0416666666666665in"}

Count formula for the first field is: Count of all Product Requirements applicable for the Product with status "Fully met" **across all releases** divided by count of all Product Requirements applicable for the Product across release chain including postponed.

Count formula for the second field: Count of all Product Requirements applicable for the Product in **the current release** with status "Fully met" divided by count of all Product Requirements applicable for the Product in the current release.

Additionally, SA&PQl must review all the information provided on the CSRR tab, including Threat Model Details, Static Code Analysis, Software Composition Analysis, and so on.

Once the review is completed the SA and PQL will have to add their recommendations in FCSR Decision tab.

1)  Click on 'Edit';

2)  Click on '+Add Participant';

3)  Enter the name and the recommendation, comments if needed.

Both Security Advisor and Process Quality Leader should provide their recommendations.

![A screenshot of a computer Description automatically generated](media/image245.png){width="6.69375in" height="2.634027777777778in"}

If the product team should provide additional information or re-do something the user can send the release for rework by clicking on the button 'Rework' and provide a justification.

![A screenshot of a computer Description automatically generated](media/image246.png){width="6.6819444444444445in" height="1.0208333333333333in"}

If the data provided is sufficient the user will click on the 'Submit for FCSR Review'.

Once both Security advisor and PQL submit for FCSR the release status is changed to "FCSR Review" and the release is moved to the next stage. The task for Security advisor and PQL will be closed and not available in the "My Tasks" list.

![A screenshot of a computer Description automatically generated](media/image247.png){width="6.69375in" height="1.0in"}

#### FCSR Decision

##### FCSR Details 

![A screenshot of a computer Description automatically generated](media/image248.png){width="6.69375in" height="2.9569444444444444in"}

The person responsible for the FCSR can enter the topics discussed during the offline meeting.

1.  Activate edit mode by clicking on "Edit"

2.  Click on "+Add Topic"

3.  Add the Topic Name, Discussion Details

![A screenshot of a computer Description automatically generated](media/image249.png){width="6.69375in" height="3.10625in"}

The FCSR participant can select from the dropdown field "FCSR Approval Decision": No Go, Go with Pre-Conditions, Go with Post-Conditions, or Go.

If the FCSR Decision requires exception "Exception Required" toggle button should be on and the comments are mandatory for entry. Either CISO, SVP, or Both should be ticked in "Submit To" multiselect to nominate for exception review and approve.

![A screenshot of a computer Description automatically generated](media/image250.png){width="6.697915573053368in" height="1.9270833333333333in"}

When FCSR Decision is selected the decision maker can either:

1)  "Approve FCSR"

2)  "Escalate" to the upper level (Security Advisor-\>LOB Security Leader -\> BU Security Officer)

3)  Return to the product team for "Rework"

![A screenshot of a computer Description automatically generated](media/image251.png){width="6.6819444444444445in" height="0.90625in"}

If the FCSR Approval Decision is \'Go with Post-Conditions\', the system will not permit FCSR Approval until at least one action tagged with the \'Post-Condition\' category is added to the release.

![A screenshot of a computer Description automatically generated](media/image252.png){width="6.69375in" height="2.9138888888888888in"}

If the FCSR Approval Decision is "Go with Pre-Conditions" the system will not allow to Approve FCSR until at least one Action with "Pre-Condition" category is added to the release.

If there are no actions with post- or pre-conditions provided, the system will warn about it:

![A screenshot of a computer Description automatically generated](media/image253.png){width="5.731944444444444in" height="1.4479166666666667in"}

##### FCSR Escalation

When FCSR is escalated to the upper level the appropriate individual will get a task to review the FCSR for release and approve an FCSR Decision, change it, or escalate to the next level (refer to [FCSR Details](#fcsr-details) section).

The escalation hierarchy is as follows:

1)  Security Advisor-\> LOB Security Leader

2)  LOB Security Leader -\> BU Security Officer.

![A screenshot of a computer Description automatically generated](media/image254.png){width="6.697915573053368in" height="1.0104166666666667in"}

##### FCSR Exception

The CISO and/or SVP LOB will get an email notification about the raised exception, and they can navigate to the screen with the FCSR exception review and approve from application. Or in the PICASso, they will get a task in "My Tasks", click on it, and the system will redirect to the "FCSR Decision" tab to review the summary of the FCSR and comments regarding required exception.

CISO/SVP will either "Approve FCSR" or send it back to the team for a "Rework".

If both CISO and SVP are requested to approve an exception, then when both approve the FCSR the release status will change to "Actions Closure" and the release will be moved to the next stage.

#### Post FCSR Actions

##### Option1: FCSR Decision "No Go"

If the FCSR Approval Decision is "No Go" the only available action button to the product team will be "Cancel" the release. Once the user clicks on the "Cancel" button, the status will be changed to "Canceled" and the release flow is ended.

![A screenshot of a computer Description automatically generated](media/image255.png){width="6.69375in" height="1.2083333333333333in"}

##### Option 2: FCSR Decision "Go" or "Go with Post-Conditions"

If the FCSR Decision was "Go" or "Go with Post-Conditions" the product team will get a task to complete the release.

![A white rectangular object with text Description automatically generated](media/image256.png){width="6.697222222222222in" height="0.875in"}

![A screenshot of a computer Description automatically generated](media/image257.png){width="6.697915573053368in" height="1.7291666666666667in"}

When the user hits "Submit" button the release status will be changed to "Completed" and the release flow is ended.

![A screenshot of a computer Description automatically generated](media/image258.png){width="6.69375in" height="1.0916666666666666in"}

##### Option 3: FCSR Decision "Go with Pre-conditions"

If the FCSR Approval Decision is "Go with Pre-Conditions" the release is moved to the Post FCSR Actions stage to work on the actions with "Pre-Condition" category to close them.

![A screenshot of a computer Description automatically generated](media/image259.png){width="3.021255468066492in" height="1.6043908573928258in"}

The user will need either submit actions to Jira or update the status manually.

![A screenshot of a computer Description automatically generated](media/image260.png){width="5.862051618547682in" height="2.532377515310586in"}

#### Final Acceptance

The user responsible for the FCSR review will receive a task to review the Post FCSR Actions closure when the FCSR Decision was "Go with Pre-Conditions" and accept them by clicking on "Final Acceptance" or revert to the product team requesting additional information or changes/adjustments.

![A green and white screen Description automatically generated](media/image261.png){width="6.689583333333333in" height="0.9770833333333333in"}

Once the responsible user selects the \'Final Acceptance\' button, the release status updates to \'Completed\':

![A white rectangular object with blue text Description automatically generated](media/image262.png){width="6.697915573053368in" height="0.8854166666666666in"}

The work on the release is now completed.

If there is a need to cancel the release, Product Owner or Security Manager should provide a justification.\
![](media/image263.png){width="7.900684601924759in" height="2.9585903324584426in"}

### 2.7 Email notifications

On each stage of the release management flow, an accountable individual will receive a task in the system and an email notification to complete this task.

#### 2.7.1. Release Creation Confirmation

**Trigger**: once a release for the product is created.

**Recipients:**

-   TO: Product Owner, Security Manager

-   CC: Security Advisor

**Email Subject:**\
Automatic Confirmation: Release \[RELEASE\] Creation and SDL Process Initiation for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We are pleased to inform you that the release \[RELEASE\] for the product \[PRODUCT\] has been successfully created in the PICASso system, and the SDL process has now been initiated.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.2. Release Scope Review

**Trigger:** Once the release is submitted for Scope Review and Confirmation

**Recipients:**

-   TO: Security Advisor, LOB Security Leader\*, BU Security Officer\*

-   CC: Product Owner, Security Manager

\* Here is a table outlining which business roles should receive notifications based on the Minimum Oversight Level and Risk Classification. These rules are applicable for FCSR Approval as well.

![](media/image264.png){width="7.90625in" height="2.3020833333333335in"}

**Email subject**:\
Automatic Request: Scope Review Requested: Release \[RELEASE\] for Product \[PRODUCT\]

**Email body**:

Dear \[RECIPIENT\],

We request you to conduct a review and confirm the scope of the release and the release risk classification for release \[RELEASE\] of the product \[PRODUCT\].

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.3. Release Scope Confirmation.

**Trigger:** Once the release scope is confirmed

**Recipients:**

-   TO: Product Owner, Security Manager

-   CC: Security Advisor, LOB Security Leader\*, BU Security Officer\*

**Email Subject**:

Automatic Confirmation: Scope of Release \[RELEASE\] for Product \[PRODUCT\] Confirmation

**Email Body**:

Dear \[RECIPIENT\],

We are pleased to inform you that the scope of release \[RELEASE\] for the product \[PRODUCT\] has been confirmed in the PICASso system. Request you to proceed to the next step of SDL process.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.4. Release Scope Re-work

**Trigger:** Once the release was returned to rework by SA/LOB SL/BU SO

**Recipients:**

-   TO: Product Owner, Security Manager

**Email Subject**:

Automatic Action Required: Scope of Release \[RELEASE\] for Product \[PRODUCT\] Requires Changes

**Email Body**:

Dear \[RECIPIENT\],

We inform you that the scope of release \[RELEASE\] for the product \[PRODUCT\] has not been confirmed in the PICASso system. Please login to the system to check what changes are requested.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.5. Release Completion Reminder

**Trigger:** Once the release is in progress the tool will calculate the remaining time before Release Target Date. And if it exceeds XX% of the release timeline the tool generates an email remainder.

**Recipients:**

-   TO: Product Owner, Security Manager

-   CC: Security Advisor

**Email Subject**:

Automatic Reminder: Pending action items for Release \[RELEASE\] for Product \[PRODUCT\]

**Email Body**:

Dear \[RECIPIENT\],

A gentle reminder that currently your Release target date is approaching and you pending action items. Your release is scheduled for readiness on \[DATE\].

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.6. Release Readiness Review for FCSR

**Trigger:** Once the release is submitted for SA&PQL Sign Off

**Recipients:**

-   CC: Product Owner, Security Manager

**Email Subject:**

Automatic Confirmation: Under Review for FCSR readiness for Release \[RELEASE\] for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We request you to kindly conduct a review ofthe Cybersecurity Residual Risks, implemented SDL Process and Product Requirements and sign off the release readiness for FCSR as a part of SDL process in PICASso.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.7. Release Readiness Confirmation

**Trigger:** Once the release is submitted by SA and PQL

**Recipients:**

-   TO: Product Owner, Security Manager

**Email Subject:**

Automatic Confirmation: Release \[RELEASE\] of the Product \[PRODUCT\] is submitted for FCSR

**Email Body:**

Dear \[RECIPIENT\],

We are pleased to inform you that the FCSR readiness for Release \[RELEASE\] for Product \[PRODUCT\] is submitted in PICASso.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.8. Release Readiness Confirmation -- ReWork

**Trigger:** If SA or PQL sends a release to rework

**Recipients:**

-   TO: Product Owner, Security Manager

**Email Subject**:

Automatic Action Required: Release \[RELEASE\] of the Product \[PRODUCT\] has been returned for a re-work

**Email Body:**

Dear \[RECIPIENT\],

We inform you that the FCSR readiness for Release \[RELEASE\] for Product \[PRODUCT\] has not been signed in PICASso and returned for a re-work. Please login to the system to check what changes are requested.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.9. FCSR Review by SA/LOB Security Leader/BU Security Officer

**Trigger:** SA and PQL sign off the release and send it to FCSR Review.

**Recipients:**

-   TO: Security Advisor/ LOB Security Leader/ BU Security Officer

-   CC: Product Owner, Security Manager

**Email Subject:**

Automatic Action Required: Release \[RELEASE\] confirmed for FCSR review by SDL SA (LOB Security Leader/BU Security Officer) for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We request you kindly conduct a Formal Cybersecurity Review for Release \[RELEASE\] of the Product \[PRODUCT\] as per SDL requirements and proceed with the decision in PICASso.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.10. FCSR Exception

**Trigger:** Once FCSR Approver raises an exception for FCSR

**Recipients:**

-   TO: CISO, SVP LOB

**Email Subject:**

Automatic Action Required: Exception Requested for Release \[RELEASE\] for Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We would like to inform you that an exception is requested for Release \[RELEASE\] of the Product \[PRODUCT\] in PICASso. Kindly review the request and make a decsion.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.11. FCSR Completion

**Trigger:** Once the release FCSR decision is submitted

**Recipients:**

-   TO: Product Owner, Security Manager

-   CC: Security Advisor

**Email Subject:**

Automatic Notification: Decision available for Release \[RELEASE\] of Product \[PRODUCT\]

**Email Body:**

Dear \[RECIPIENT\],

We would like to inform you that the decision for Release \[RELEASE\] of the Product \[PRODUCT\] is avaialble in PICASso. Request you to proceed to the next step of SDL process.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.12. Final Approval

**Trigger:** When an FCSR is completed and there were action items with status 'Pre-Condition' in the release.

**Recipients:**

-   TO: Security Advisor, LOB Security Leader\*, BU Security Officer\*

**Email Subject:**

Automatic Action Required: Review the Release \[RELEASE\] for Product \[PRODUCT\] for final Approval

**Email Body**:

Dear \[RECIPIENT\],

We request you to kindly review the completion of pre-condition action items for the Release \[RELEASE\] of Product \[PRODUCT\] in PICASso and provide a decision.

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.13. Release Completion - Completed

**Trigger:** Once the release is completed.

**Recipients:**

-   TO: Product Owner, Security Manager, Security Advisor, LOB Security Leader, BU SO, CISO

**Email Subject:**

Automatic Notification: Release \[RELEASE\] for Product \[PRODUCT\] is Completed

**Email Body:**

Dear \[RECIPIENT\],

We are please to inform you that the Release \[RELEASE\] of the Product \[PRODUCT\] is Completed in PICASso. For more information please check the application (link?).

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.14. Release Completion - Cancelled

**Trigger:** the release was cancelled due to some reasons

**Recipients:**

-   TO: Product Owner, Security Manager, Security Advisor, LOB Security Leader, BU SO

**Email Subject:**

Automatic Notification: Release \[RELEASE\] for Product \[PRODUCT\] is Cancelled

**Email Body:**

Dear \[RECIPIENT\],

We regret to inform you that the Release \[RELEASE\] of the Product \[PRODUCT\] is Cancelled in PICASso. For more information please check the application \[LINK\].

If you have any further questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

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

Delegator\'s open tasks were assigned to you in PICASso, check the \'My Tasks\' tab.

Please contact \<delegator\> if you have questions about the delegation. If you have any other questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

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

If you have any other questions or require additional support, please don\'t hesitate to reach out SM Global PICASso support.

Best regards

PICASso Support Team

#### 2.7.17. Notification for Actions Assignment

**Trigger:** Action has been created and assigned to user/Action that didn't have assignee has been assigned to user

**Recipients:**

-   TO: Action Assignee

-   CC: Product Owner, Security Manager, Security Advisor

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

All action performed in the release are logged in the Release History. Click on the 'View Release History' to open a pop-up.

![](media/image265.png){width="6.905599300087489in" height="3.3481692913385825in"}

Once clicked, you will see a table with a list of activities, their description and users who performed these activities:

![](media/image266.png){width="7.90625in" height="3.8645833333333335in"}You can search for specific user or description, filter by activities and select a date range. Click 'Search' to apply filters.

![](media/image267.png){width="7.90625in" height="3.8645833333333335in"}

### 2.9. Stage Responsibles Side Bar

This functionality is designed to ensure users can efficiently manage and review each stage of the release process.

Each stage in the release flow is clickable and opens a side bar on the right side of the screen.

A 'Need Help' button is located in the upper-right corner of the screen. Clicking this button also opens the same side bar, offering quick access to all relevant stage information.

![A screenshot of a computer AI-generated content may be incorrect.](media/image268.png){width="7.9in" height="3.8194444444444446in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image269.png){width="7.9in" height="2.5277777777777777in"}

**Side Bar Overview**

1\. Header: Complete Release Stage

The header displays the name of the stage the release is currently in.

![A screenshot of a computer AI-generated content may be incorrect.](media/image270.png){width="7.9in" height="3.701388888888889in"}

**Stage Responsibles Section**

This section provides granular details about the individuals responsible for the current stage and the actions required to proceed.

![A screenshot of a computer AI-generated content may be incorrect.](media/image271.png){width="7.9in" height="3.8152777777777778in"}

This section includes:

-   Number of Submissions: Indicates how many submissions are needed to move the release to the next stage.

-   Dynamic List of Responsible Individuals: A table displaying the users responsible for completing this stage. The table contains the following three columns:

1\. User: Name of the responsible user.

2\. Role: The assigned role of the user (e.g., Security Advisor, Privacy Reviewer).

3\. Approval Date: Date when the user approved the stage. If the user hasn\'t approved yet, this field will remain empty.

\- In addition, a green checkmark will appear to the left of a user\'s name once the individual has approved the stage.

**Stage Description Section**

A brief description of the stage is presented:

![A screenshot of a computer AI-generated content may be incorrect.](media/image272.png){width="7.9in" height="3.8229166666666665in"}

**Justification for Rework**

If a release is returned to rework at any stage, the justification comment will be displayed here. The justification appears in the stage that the release transitions to for rework. [Example:]{.underline} *If the Security Advisor sends the release back to the Manage stage due to incomplete information during the SA&PQL Sign Off stage, the justification will appear on the Manage stage of the side bar.*

![A screenshot of a computer AI-generated content may be incorrect.](media/image273.png){width="7.9in" height="3.8506944444444446in"}

**Navigation Buttons**

At the bottom of the side bar, two navigation buttons are available:

1\. Previous Stage: Displays the information for the preceding stage.

2\. Next Stage: Displays the information for the subsequent stage.

These buttons allow users to easily navigate between stages without having to close and reenter the side bar.

A close button (cross icon) is also available to exit the side bar and return to the main release flow screen.

![A screenshot of a computer AI-generated content may be incorrect.](media/image274.png){width="4.083687664041995in" height="7.567322834645669in"}

**Additional Details**

1\. Approval by Unauthorized Users.

If a release stage is approved by a user who is not officially assigned to that stage, the user\'s name will still appear in the Stage Responsibles section of the side bar.

Example: If the BU Security Officer approves the 'Review and Confirm' stage instead of the Security Advisor, the name of the BU Security Officer will be logged in this section.

2\. Dynamic Assignment of Responsible Users

If the questionnaire has not yet been submitted (at the 'Creation & Scoping Stage'), the individuals responsible for the subsequent stages will be determined based on the Minimum Oversight Level (MOL) of the product :

When MOL is set to \"Team\", the individual responsible for the 'Review & Confirm', 'FCSR Review', and 'Final Acceptance' stages will be the Security Advisor.

For an MOL of \"LOB SL\", the responsible individual will reflect that specific user.

**Dynamic List Updates**

The list of responsible users is dynamic, meaning it will automatically adjust based on changes to:

1\. Risk Classification

2\. Data Privacy Review Applicability:

-   If a Data Privacy review is needed for the release (triggered by specific conditions) the following adjustments will be made:

At the 'Review and Confirm' stage, a Privacy Advisor will be added to the list.

At the 'Security and Privacy Readiness Sign Off' stage, a Privacy Reviewer will be included as a responsible individual.

### 2.10 Maintenance and Informative/Warning Banner

#### 2.10.1. Maintenance Banner

During the deployment of new features and enhancements by the Picasso team, the system will be temporarily unavailable. End-users will see a notification banner indicating this downtime. Once the deployment is complete, the system will be accessible again. A confirmation will be shared via Viva Engage.

![A screenshot of a computer AI-generated content may be incorrect.](media/image275.png){width="7.9in" height="3.808333333333333in"}

#### 2.10.2. Informative/Warning Banners

**Informative Banner**

-   Purpose: To display important non-critical messages for user awareness (e.g., announcements, tips, system updates).

-   Appearance: Light blue color.

-   Behavior: Stays visible throughout the system until the user manually closes it.

**Warning Banner**

-   Purpose: To display critical or cautionary messages (e.g., warnings about upcoming downtime, potential issues, or urgent notices).

-   Appearance: Light orange color.

-   Behavior: Stays visible throughout the system until the user manually closes it.

![A screenshot of a computer AI-generated content may be incorrect.](media/image276.png){width="7.9in" height="1.5444444444444445in"}

### 2.11. Actions Management

The Actions Summary pop-up has been enhanced with several new features and updates to improve the user experience. First of all, the 'Actions Summary' was renamed to 'Actions Management' and is opened in the separate browser window.

Secondly, now it possible to access the page not only from the release, but from the product as well.

![](media/image277.png){width="7.90625in" height="3.5833333333333335in"}![](media/image278.png){width="7.90625in" height="3.875in"}

The Actions Management page has the following view:

![](media/image279.png){width="7.90625in" height="3.8229166666666665in"}

A page displays all the actions created for the product across different releases.

-   **Closed actions** are hidden by default but can be included using the toggle 'Include Closed' switch.

**Columns and Sorting Options**

-   **Action Name** -- displays the name of the action, is clickable and leads to this action in the release.

-   **Due Date** -- shows the deadline for action completion

-   **Status** -- represents the status of the action: Open, In Progress, On Hold, Closed.

-   **Jira Link** -- if the action was sent to Jira, this column contains a link to the corresponding Jira ticket.

-   **Release Number -** indicates the release in which the action was initially created.

-   **Assignee** - displays the user name whom the action was assigned.

-   **Category** -- represents the category of the action: Pre-Condition, Post-Condition, Tracked.

-   **Origin** -- shows where the action was created. For example, SDL Processes Summary, FCSR Decision Tab, Review and Confirm tab, etc.

-   The list is **sorted by the \"Due Date\" column** by default in ascending order.

**Filters**

-   **Search** field: allows to search by the action name

-   **Status**: dropdown list, allows to show actions with selected status

-   **Release Number:** dropdown list, allows to filter by the specific release

-   **Assignee** -- lookup field to filter by the user to whom the action is assigned

-   **Category** -- dropdown list to show the actions with specific category only

-   **Due Date Range** - date picker. Allows to select the dates when the action was created.

-   **Reset Button** -- clears all filters

#### 2.11.1. How to Use the Actions Management Page

**1. Viewing Actions**

-   By default, the page loads with all actions from different releases displayed.

-   Closed actions are hidden but can be displayed by toggling the switch.

![](media/image280.png){width="7.90625in" height="3.78125in"}

**2. View Action Details Within the Same Page**

To see the details of the action, click on three dots icon and click 'Edit' (for the products managed in Jira). If the product is not managed in Jira, click on pencil icon:

![](media/image281.png){width="7.90625in" height="3.625in"}A pop-up will appear with the action details:

![](media/image282.png){width="7.90625in" height="3.8125in"}Click 'Edit' again to make changes:

![](media/image283.png){width="7.90625in" height="3.7395833333333335in"}

To send action to Jira, click on 'Three dots' and 'Submit to Jira':

![](media/image284.png){width="7.90625in" height="2.59375in"}Click 'Submit' again in the opened pop-up window:

![](media/image285.png){width="7.90625in" height="3.8229166666666665in"}Once the action is submitted to Jira, you will see a link in the 'Jira Link' column:

![](media/image286.png){width="7.90625in" height="2.375in"}Data from Jira is automatically refreshed once per day, but if you want to receive the most recent information, click on the 'Refresh Jira Data' button at the upper right corner of the screen:

![](media/image287.png){width="7.90625in" height="2.3125in"}

#### 2.11.2. How to create an action from Actions Management page

1\. Click on 'Create Action' button.

![A screenshot of a computer AI-generated content may be incorrect.](media/image288.png){width="7.9in" height="3.7875in"}

2\. A pop-up will be opened where you need to specify action's details:

![A screenshot of a computer AI-generated content may be incorrect.](media/image289.png){width="7.9in" height="3.65in"}

\- Name: specify the name of the action. Mandatory field.

\- Status: by default 'Open' status is selected, but you can select another status from the dropdown list.

\- Evidence link -- mandatory if the status is 'Closed'

\- Category -- this field is hidden, by default the category for actions created on Action Management page have 'Tracked' category.

\- Due date -- date picker. Here you can select target date for the action's completion. Non-mandatory. Past dates can't be selected. Can be edited in following cases:\
1) when action is available for editing in the linked release (stage where the action is created is the same as the current stage of this release)

\- Assignee -- here you can select the person responsible for the action's completion.

\- Closure comment -- this field appears when the action status is 'Closed'. Mandatory field.

\- Description -- here you can specify what should be done in more details.

When you specify all the details, click to 'Create' to save the action.

![A screenshot of a computer AI-generated content may be incorrect.](media/image290.png){width="7.9in" height="3.785416666666667in"}Once created, the action will appear in the list of actions on the Actions Management page. The origin of this action will be 'Actions Management' and it won't be displayed anywhere in the release.

![A screenshot of a computer AI-generated content may be incorrect.](media/image291.png){width="7.9in" height="3.821527777777778in"}

You can edit action's details by clicking 'Pencil' icon. First you will see a pop-up with details and then click 'Edit' to adjust.

![A screenshot of a computer AI-generated content may be incorrect.](media/image292.png){width="7.9in" height="3.8201388888888888in"}

If action was created on another stage of the release comparing to where release currently is - only fields \"Status\", \"Closure Comment\", \"Evidence\" and \"Assignee\" are available for editing. Other fields are shown in the disabled state.

![A screenshot of a computer AI-generated content may be incorrect.](media/image293.png){width="7.9in" height="3.702777777777778in"}

#### 2.11.3. Actions Management History

To see the history of changes on the Actions Management page click on the 'View History' link:

![](media/image294.png){width="7.9in" height="3.7819444444444446in"}

Once clicked, a pop-up will be opened, where you will see all the records related to the changes in actions:

![A screenshot of a computer AI-generated content may be incorrect.](media/image295.png){width="7.9in" height="6.7034722222222225in"}

You will see who and when made changes, the activity type, action name, description, assignee of the action, release where the action was created (if it was created from the Actions Management page, you will see 'No release' in this column) and the origin -- either corresponding tab/section in the release or 'Actions Management' if it was created from this page.

There are several filters, you can:

-   Search by the action's description

-   Filter by activity: Actions Update or Jira Submission

-   Select a date range of the history

-   Filter by assignee

-   Filter by release number

-   Filter by the origin of the action

You can also reset the filters by clicking 'Reset' button.

The activities (either on the Actions Management page or in the release) that are logged in the history include:

-   Action's creation.

-   Action details update.

-   Action status update -- as a separate record.

-   Jira submission.

-   Manual refresh data from Jira -- from Actions Management page only.

#### 2.11.4. Actions status bar chart on Actions Management page

On the Actions Management page you can see the bar chart with information on the count of all actions available for the product in each possible status.

-   Total number of actions available for the product on the left

-   List of available actions statuses along with the number of actions for each status on the right

-   The horizontal bar chart with the number of actions for each status

The bar chart is displayed when at least one action is added to the Actions Management page.

![](media/image296.png){width="7.9in" height="3.839583333333333in"}

#### 2.11.5. Actions Summary section on the Review&Confirm tab

The \"Actions Summary\" section provides users with a quick overview of actions associated with the product during the Review and Confirm stage.

The \"Actions Summary\" section is designed to provide a snapshot of actionable data for each product in a visually engaging and accessible way. By default:

-   Collapsed View: When the \"Review and Confirm\" tab is opened, the \"Actions Summary\" section is hidden (collapsed).

-   To view details, the user must click on the Actions Summary label, which expands the section to display actionable insights via a bar chart and filters.

Note: If the product does not have any actions associated with it, the \"Actions Summary\" section will not be displayed on the \"Review and Confirm\" tab.

When the Actions Summary section is expanded, a **bar chart** displays the count of all actions available for the product, grouped by their status. Below are the details provided by the chart:

![A screenshot of a computer AI-generated content may be incorrect.](media/image297.png){width="7.9in" height="3.813888888888889in"}

**Bar Chart Breakdown**

-   **Chart Representation**:

    -   Actions are segmented by their **status** (Open, In Progress, On Hold, and Closed).

    -   Each segment is color-coded based on the action\'s status:

        -   **Open**: Blue

        -   **In Progress**: Yellow

        -   **On Hold**: Grey

        -   **Closed**: Green

    -   The percentage of actions from the total number is displayed alongside the color-coded legend.

**Legend Details**

-   **Total Actions**: The total number of actions is displayed on the left side of the chart.

-   **Action Statuses**: A color-coded legend on the right helps users identify the count of each type of action.

**Filters in the Actions Summary Section**

To fine-tune the bar chart data, the Actions Summary section includes the following filters:

-   Status Filter: A dropdown menu allows users to select a specific status of actions to focus on. Note: When \"Closed\" is selected, the \"Include Closed\" toggle will automatically activate unless it is already active.

-   Due Date Range: a calendar widget enables users to select a date range for filtering actions. Default Date Range: when the page opens, the period is preselected with the range: \"01 Jun 2024 - \<Target release date for the current release\>\".

-   Include Closed: a toggle that allows users to view closed actions alongside open actions. Default State: Unchecked when the page is opened. When enabled, closed actions will be included in the bar chart data.

![A blue and grey bar AI-generated content may be incorrect.](media/image298.png){width="7.9in" height="1.5645833333333334in"}

**Actions Summary Data Behavior and Snapshot Updates**

The data displayed in the Actions Summary section is a **snapshot** reflecting the current state as the product moves through release stages. Below is how data behavior is governed based on user actions:

-   When the release moves from the **Review and Confirm stage** to the **Manage stage** (through the \"Submit and Review\" button), the chart data is **frozen** to reflect the current state at the moment of transition.

-   Once frozen, the data will not update, regardless of future changes to actions.

-   If the release reverts to the **Creation and Scoping stage** from the **Review and Confirm stage**, the chart data will reflect the updated state of actions based on the \"current moment.\"

2.11.6. Email Notifications for Actions

Once the action has been assigned to the

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

This tooltip helps clarify the status of requirements in different stages of the process. These tooltips are added to the \"Status\" column in the following locations:

Process Requirements Tabs

Product Requirements Tabs

Cybersecurity Residual Risks Tabs (SDL Process Summary Section & Product Requirements Summary Section)

*Tooltip Definitions:*

[Planned:]{.underline} The requirement is planned for this release.

[In Progress:]{.underline} The requirement is being worked on during the current release.

[Done:]{.underline} The requirement is completed in the current release.

[Partial:]{.underline} The requirement is partially covered in this release.

[Delegated:]{.underline} The requirement was assigned to another team or partially completed and transferred to another team.

[Not Applicable:]{.underline} The requirement is irrelevant for this release.

[Postponed:]{.underline} The requirement is postponed for future releases.

**Tooltip for Product Type (Product Details page)**

A \"Learn More\" link can be found next to the \"Product Type\" title on the Product Details Page. When clicked, a pop-up will appear. It explains the different product types:

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

2.  Find the \"Roles Delegation\" button.

    -   Note: This button is only visible to authorized users. If you're unable to locate it, please check your permissions with an administrator.

3.  Click the \"Roles Delegation\" button.

    -   A new browser tab will open the \"Roles Delegation\" page.

![A screenshot of a computer AI-generated content may be incorrect.](media/image299.png){width="6.5in" height="3.1847222222222222in"}

#### 2.13.2. Roles Delegation Page Layout

The Roles Delegation page is divided into two tabs: My Roles and Org Level Users.

My Roles tab represents a list of roles that logged user has. It has a tabular layout that provides an overview of roles and their delegation statuses. Each row represents a unique role, with the following key columns:

1.  **Role Name:** Displays the name of the role (e.g., Product Owner, Security Manager).

2.  **Scope:** Indicates the scope level and its corresponding name (e.g., Org Level 1 - Industrial Automation).

3.  **Delegated Person:** The name of the individual to whom the role has been delegated. This field remains blank if no delegation has been assigned.

4.  **Start Date:** The date when the delegation begins.

5.  **Expiration Date:** The date when the delegation ends.

6.  **Actions:**

    -   If no delegation exists, a **\"Delegate\"** button appears. Clicking this button triggers a popup for assigning the role.

    -   If a delegation exists, three dots appear, offering the following options:

        -   **Edit Delegation:** Opens a pop-up to modify delegation details.

        -   **Remove Delegation:** Ends the delegation and resets the role assignment.

![A screenshot of a computer AI-generated content may be incorrect.](media/image300.png){width="7.9in" height="3.842361111111111in"}

Org Level Users tab displays a list of users that belong to the scope of logged in user.

For example,

If logged user has Global role then they will see users with Org Level 1 2 3 and Product scope

If the logged user has Org Level 1 (BU Security Officer) role then they will see users with Org Level 2, 3 and product scope under their BU (e.g. Industrial Automation)

If the logged user has Org Level 2 role (LOB Security Leader) then they will see users with Org Level 3 and product scope

If the logged user has Org Level 3 role (LOB Security Leader Org 3) then they will see users with Product scope.

If logged user has Product role (e.g. Product Owner) then they will see users within their product (Security Manager, PQL, Security and Protection Advisor, Dedicated Privacy Advisor).

Org Level Users tab includes User Name, Email, LEAP License (active/inactive) and View details button. You can search user by the name using 'Search' field.

![A screenshot of a computer AI-generated content may be incorrect.](media/image301.png){width="7.9in" height="3.8506944444444446in"}

To open the list of roles for specific user, click on 'View Details' button:

![A screenshot of a computer AI-generated content may be incorrect.](media/image302.png){width="7.9in" height="3.85in"}

Once clicked, you will see the roles and will be able to delegate it. The page looks almost the same as on 'My Roles' tab:

![A screenshot of a computer AI-generated content may be incorrect.](media/image303.png){width="7.9in" height="3.85in"}

Here you can either delegate the role/remove role delegation manually by clicking on 'Delegate'/'Remove Delegation buttons in each row, or in bulk by checking checkboxes and use Bulk Actions section in the header:

![A screenshot of a computer AI-generated content may be incorrect.](media/image304.png){width="7.9in" height="3.8881944444444443in"}

#### 2.13.3. Assigning a Role (Delegation Flow)

**Steps to Delegate a Role:**

1.  Identify the role you want to assign in the table.

2.  Click the **\"Delegate\"** button in the \"Actions\" column.

![A screenshot of a computer AI-generated content may be incorrect.](media/image305.png){width="7.9in" height="3.8305555555555557in"}

-   A pop-up window will appear.

![A screenshot of a computer AI-generated content may be incorrect.](media/image306.png){width="7.9in" height="3.8604166666666666in"}

3.  Fill in the following fields within the popup:

    -   **Assignee:** Use the look-up field to select the individual.

        -   *Note: This field is mandatory and must validate the user in the system.*

    -   **Start Date:** Select a date using the date picker.

        -   *Note: You cannot select a past date. Do not forget to specify the time.*

    -   **Expiration Date:** Select an expiration date using the date picker.

        -   *Note: The expiration date must be after the start date.*

        -   A governance message will appear for delegation periods longer than 3 months:\
            *\"Please note, that delegation period is monitored by the Governance team.\"*

    -   **Justification:** Provide a rationale for the delegation in the free-text field.

        -   *Note: This field is mandatory.*

4.  Click the **\"Delegate\"** button. A confirmation prompt will appear:\
    *\"\<Role\> role will be delegated to \<Assignee\>. Do you wish to proceed?\"*

![](media/image307.png){width="7.9in" height="3.8243055555555556in"}

5.  If confirmed, the system will:

    -   Save the delegation.

    -   Update the table with the delegated user\'s details, start date, and expiration date.

6.  Receive a success message:\
    *\"Role delegation saved successfully.\"*

![](media/image308.png){width="7.9in" height="3.892361111111111in"}

#### 2.13.4. Editing or Removing a Role Delegation

**Edit Delegation:**

1.  Click the three dots in the \"Actions\" column for a delegated role.

2.  Select **\"Edit Delegation.\"**

![](media/image309.png){width="7.9in" height="3.7895833333333333in"}

3.  Update any required fields in the popup (e.g., assignee, start date, expiration date, or justification).

![](media/image310.png){width="7.9in" height="3.763888888888889in"}

4.  Save the changes.

    -   The table will update with the revised delegation details.

**Remove Delegation:**

1.  Click the three dots in the \"Actions\" column for a delegated role.

2.  Select **\"Remove Delegation.\"**

![](media/image311.png){width="7.9in" height="3.83125in"}

3.  Confirm the action in the popup.

![](media/image312.png){width="7.9in" height="3.8361111111111112in"}

-   The system will clear the assignee, start date, and expiration date fields, and replace the three dots with a \"Delegate\" button.

![](media/image313.png){width="7.9in" height="3.8291666666666666in"}

#### 2.13.5. Performing Bulk Role Delegation

**Steps:**

1.  Use the checkboxes in the table to select multiple roles for delegation or removal.

    -   *Select All:* Use the top checkbox to select all visible roles in the table.

2.  Navigate to the \"Bulk Actions\" section (above the table).

    -   *Note: Buttons will only be activated based on the status of the selected roles (unassigned, assigned, or mixed).*

3.  Choose an action:

    -   **Delegate:** Opens a pop-up to assign delegates for all selected roles.

    -   **Remove Delegation:** Triggers a confirmation popup to end delegation for all assigned roles.

![](media/image314.png){width="7.9in" height="3.823611111111111in"}

**Bulk Delegation Workflow:**

1.  In the pop-up, provide/edit the following details for selected roles:

    -   Delegatee (via look-up field).

    -   Start Date (cannot be in the past).

    -   Expiration Date (with governance warnings if \>3 months).

    -   Justification.

2.  Save the changes.

![](media/image315.png){width="7.9in" height="3.847916666666667in"}

**Bulk Removal Workflow:**

1.  Confirm the action in the pop-up.

    -   *Note: Only roles with delegatees will be affected.*

2.  The system will:

    -   Remove delegatees.

    -   Clear associated delegation details.

![](media/image316.png){width="7.9in" height="3.8333333333333335in"}

#### 2.13.6. Viewing Delegated Roles on Product/Release Pages

**Product Details Page:**

1.  Delegated roles are displayed in the **Product Team** section.

    -   The delegatee\'s name appears below the delegator\'s name.

2.  Delegated roles are displayed on the Roles&Responsibilities tab in the release.

![A screenshot of a computer AI-generated content may be incorrect.](media/image317.png){width="6.5in" height="3.1625in"}

3.  Hover over a delegatee\'s name to view the tooltip justification.

    -   *Example: \"Delegated person with justification: The role was delegated due to 'Workload prioritization during a critical project.'\"*

![A screenshot of a computer AI-generated content may be incorrect.](media/image318.png){width="6.5in" height="3.151388888888889in"}

#### 2.13.7. Role Delegation Privileges and Expiration Behavior

1.  **Delegator Privileges Post-Delegation:**

    -   Even after delegating a role, the original delegator retains their permissions within their scope of responsibility.

2.  **Post-Expiration Behavior:**

    -   Once the expiration date passes:

        -   The delegatee\'s access is automatically revoked.

        -   The role in the table resets (clearing delegation details and restoring the \"Delegate\" button).

**8. Success Notifications**

Throughout the Role Delegation process, the system will display clear success messages after every action, such as:

-   *\"Role delegation saved successfully.\"*

-   *\"Delegation successfully ended for \<X\> roles.\"*

-   *\"Delegation details successfully updated for \<X\> roles.\"*

These messages ensure user confidence and transparency regarding delegation activities.

#### 2.13.8. Roles Delegation History

The *Roles Delegation History* feature provides users with permission to view and edit the Roles Delegation page a detailed log of delegation activities. This log includes comprehensive records of all delegation-related operations, complete with filtering, sorting, and pagination functionality. This chapter outlines how to access and use the Roles Delegation History to view, filter, and analyze delegation data efficiently.

To view the history, follow these steps:

1.  Open Roles Delegation page.

2.  Find 'Delegation History' button:

![A screenshot of a computer AI-generated content may be incorrect.](media/image319.png){width="7.9in" height="3.782638888888889in"}

3.  Click on the button to open a pop-up window titled Roles Delegation History.

4.  The Roles Delegation History pop-up provides a detailed table tracking various delegation activities. Below are the features and capabilities of this view.

Table Columns

-   Date - displays the exact timestamp in the format: dd mmm yyyy, hh:mm (e.g., 15 Mar 2023, 10:45). Sortable: Clicking the column header toggles sorting between ascending and descending order. Default sorting order is descending.

-   User - displays the name of the user who performed the delegation activity. Includes the user\'s profile image or a default placeholder if no image is available.

-   Role Holder - displays the name of the user whose role was affected, especially in cases where delegation was done by other authorized users (i.e., not the currently logged-in user). Includes the user\'s profile image or a default placeholder if no image is available. This column appears only for users authorized to delegate roles to others.

-   Activity - describes the type of delegation activity. Possible actions include: Role Delegation Assignment, Removal, Update, Expiration

-   Description - provides detailed explanations of the action taken, including assigned, removed, updated, or expired roles, as well as changes to delegatee names, justifications, and dates.

Examples of descriptions:

Role Delegation Assignment: Product Owner role has been delegated to John Smith.

-   Origin - displays the source tab from the Roles Delegation page where an activity originated: My Roles/Org Level Users

When the role was delegated by someone other than the currently logged-in user, the Origin column will remain empty.

![](media/image320.png){width="7.9in" height="3.8256944444444443in"}

Filtering Roles Delegation History

A filter panel is available at the top of the Roles Delegation History pop-up, allowing users to refine and search through the delegation records. You can search record by user, description; filter by activity and date range.

![A screenshot of a computer AI-generated content may be incorrect.](media/image321.png){width="7.9in" height="6.689583333333333in"}

If no records match the selected filters, a message will display: \"No results found.\"

All active search terms and filters will remain visible for quick adjustment.

#### 2.13.9. Tasks Assignment

When a role is delegated, all tasks in the **\"Open\"** status from the delegator\'s *My Tasks* tab will be made available to the delegatee. Both the delegator and the delegatee will have access to the *Open* tasks.

If a task is completed and marked as **Closed** by either the delegator or the delegate, the task will automatically update its status to *Closed* for both users.

When the delegation expires or is removed:

-   All *Open* tasks that had been transferred to the delegatee will be automatically removed from their *My Tasks* tab.

-   These tasks will be reassigned back to the original delegator. This ensures that the ownership of unfinished tasks reverts to the original assignee after the delegation period ends.

#### 2.13.10 Email Notifications for Role Delegation

When the delegation was made or removed/expired, the delegate user will receive email about it. Once the delegation is made all the emails within release management workflow will be sent to the delegate user. Upon role delegation removal all future emails will be sent to the initial user.

### 2.14. Product/Release Inactivation

The ability to inactivate Products and Releases is restricted to users with specific privileges, ensuring controlled access. Only Product Admins have a permission to inactivate products and releases. Roles such as \"Product Owner\" and \"Security Manager\" do not have permissions to inactivate Products or Releases.

Before attempting to inactivate a Product or Release, ensure that the following conditions are met:

A Product can be inactivated if:

-   It has no Releases/DOCs associated with it.

-   It has only Cancelled Releases/DOCs.

A Release can be inactivated if:

-   It is in the **Creation & Scoping** stage.

**Inactivate Product Button**

-   **My Products Tab:**

    -   An additional "Actions" column displays three dots (**\...**).

    -   Clicking this icon reveals options, including the \"Inactivate\" button.

![A screenshot of a computer AI-generated content may be incorrect.](media/image322.png){width="7.9in" height="3.734027777777778in"}

-   **Product Details Page:**

    -   Three dots next to the Product status in the header reveal the \"Inactivate\" option.

![A screenshot of a computer AI-generated content may be incorrect.](media/image323.png){width="7.9in" height="3.807638888888889in"}

-   **Disabled Condition:**

    -   If the Product does not meet inactivation conditions, the button will appear greyed out with a tooltip:

![A screenshot of a computer AI-generated content may be incorrect.](media/image324.png){width="7.9in" height="3.8472222222222223in"}

**Inactivate Release Button**

**My Releases Tab:**

-   The "Actions" column contains three dots (**\...**). Clicking this icon reveals options, including \"Inactivate.\"

![A screenshot of a computer AI-generated content may be incorrect.](media/image325.png){width="7.9in" height="3.7263888888888888in"}

**Releases Tab in Products:**

-   In the "Actions" column of this tab, three dots (**\...**) reveal both \"Inactivate\" and \"Clone\" options.

![A screenshot of a computer AI-generated content may be incorrect.](media/image326.png){width="7.9in" height="3.7756944444444445in"}

**Disabled/Unavailable Buttons:**

-   For **active Releases** beyond the \"Creation & Scoping\" stage: The button is greyed out with a tooltip: **\"Release cannot be inactivated as it passed \'Creation & Scoping\' stage. If this release is no longer valid, it can be cancelled.\"**

![A screenshot of a computer AI-generated content may be incorrect.](media/image327.png){width="7.9in" height="3.7215277777777778in"}

-   For **Completed Releases:**

    -   The \"Inactivate\" button is not displayed (only \"Clone\" is available).

-   For **Cancelled Releases:**

    -   If **No-Go FCSR Decision** caused the automatic cancellation, the \"Inactivate\" button is not displayed.

    -   If manually cancelled, the button is visible. Once inactivated, it will be possible to create a new release with the same name.

**Confirming Inactivation**

Clicking \"Inactivate\" for a Product or Release triggers a confirmation modal to ensure intentional action:

![A screenshot of a computer AI-generated content may be incorrect.](media/image328.png){width="7.9in" height="4.777777777777778in"}

**Post-Inactivation Behavior**

Once the product is inactivated, the status of the Product is updated to **Inactive** (on both the \"My Products\" tab and the Product Details page).

![A screenshot of a computer AI-generated content may be incorrect.](media/image329.png){width="7.9in" height="3.421527777777778in"}

![A screenshot of a computer AI-generated content may be incorrect.](media/image330.png){width="7.9in" height="3.6847222222222222in"}

Interface changes:

A toggle replaces the previous \"Show Inactive Products\" button with \"Show Active Only.\"

-   **Enabled by default:** Displays only active Products.

-   **Disabled:** Displays both active and inactive Products.

> ![A screenshot of a computer AI-generated content may be incorrect.](media/image331.png){width="7.9in" height="3.8618055555555557in"}

Hovering over the status displays the justification entered during inactivation:

![A screenshot of a computer AI-generated content may be incorrect.](media/image332.png){width="7.9in" height="3.7666666666666666in"}

Inactive Products are no longer editable, and new Releases/DOCs cannot be created for them.

**Releases**

The status of the Release is updated to **Inactive** and are displayed on \"My Releases\" tab, \"Releases\" tab of the Product, and on the Release Details page.

![A screenshot of a computer AI-generated content may be incorrect.](media/image333.png){width="7.9in" height="3.8555555555555556in"}

-   Interface changes:

The \"Show Completed Releases\" toggle is replaced with \"Show Active Only\":

-   **Enabled by default:** Displays only ongoing Releases.

-   **Disabled:** Displays Releases with statuses \"Completed,\" \"Cancelled,\" and \"Inactive.\"

![A screenshot of a computer AI-generated content may be incorrect.](media/image334.png){width="7.9in" height="3.8680555555555554in"}

Hovering over the status displays the justification entered during inactivation:

![A screenshot of a computer AI-generated content may be incorrect.](media/image335.png){width="7.9in" height="3.698611111111111in"}
