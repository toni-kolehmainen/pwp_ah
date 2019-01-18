# Important information for Deadline 2


:bangbang:&nbsp;&nbsp;**This chapter should be completed by Deadline 2** *(see course information at [Lovelace](http://lovelace.oulu.fi))*

---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Chapter summary</strong>
</summary>

<bloquote>
In this section students must design and implement the database structure (mainly the data model).

In this section you must implement:
<ul>
<li>The database table structure.</li>
<li>The data models (ORM)</li>
<li>Data models access methods (if needed)</li>
<li>Populating the database using the models you have created</li>
<li>A simple testing showing that your ORM works as expected</li>

<ul>
</bloquote>
<strong>In this section you should aim for a high quality small implementation instead of implementing a lot of features containing bugs and lack of proper documentation.</strong>
<h3>SECTION GOALS:</h3>
<ol>
<li>Understand database basics</li>
<li>Understand how to use ORM to create database schema and populate a database</li>
<li>Setup and configure database</li>
<li>Implement database backend</li>
<li>Write tests</li>
</ol>
</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Chapter evaluation (max 10 points)</strong>
</summary>

<bloquote>
You can get a maximum of 10 points after completing this section. More detailed evaluation is provided after each heading.
</bloquote>

</details>

---

# Database design and implementation

## Database design
---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>
Describe your database. The documentation must include:
<ul>
<li>A name and a short description of each database model. Describe in one or two sentences what the model represents.</li>
<li>An enumeration of the attributes (columns) of each model. Each attribute must include:
	<ul>
		<li>Its type and restrictions (values that can take)</li>
		<li>A short description of the attribute whenever the name is not explicit enough. E.g. If you are describing the users of a "forum", it is not necessary to explain the attributes "name", "surname" or "address" </li>because their meanings are obvious.
		<li>Characteristics of this attribute (e.g. if it is unique, if it contains default values)</li>
	</ul>
</li>
<li>Connection with other models (primary keys and foreign keys)</li>
<li>Other keys</li>
</ul>
You can use the table skeleton provided below

For this section you can use a visual tool to generate a diagram. Be sure that the digram contains all the information provided in the models. Some tools you can use include: <a href="https://dbdesigner.net">https://dbdesigner.net/</a>, <a href="https://www.lucidchart.com/pages/tour/ER_diagram_tool">https://www.lucidchart.com/pages/tour/ER_diagram_tool</a>, <a href="https://dbdiffo.com/">https://dbdiffo.com/</a>

</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 3 points)</strong>
</summary>

<bloquote>
You can get a maximum of 3 points after completing this section.
<ul>
<li>Design of database is coherent: <strong>1.0</strong></li>
<li>Each model and its attributes are named: <strong>0.5</strong></li>
<li>Details for attributes are provided (datatype, default value, characteristics etc.): <strong>0.5</strong></li>
<li>Foreign keys follow the relationship diagram from deadline 1: <strong>1.0</strong>
	<ul></li>
		if necessary, you can update your diagram 
	</li></ul>
</li>
</ul>
</bloquote>

</details>

---

:pencil2: *The table can have the following structure*

|**Name** | **Type**|**Restrictions**|**Description**|**Characteristics** | **Links**|
|:------: |:-------:|:--------------:|:-------------:|:-----------------: |:--------:|
|Name of the attribute|Attribute type|Values that the type can take|Description of the attribute|Uniquenes, default...| keys and foreign keys|
||||||| 
||||||| 
||||||| 

:pencil2: *Do not forget to include a diagram presenting the relations*

## Database implementation
---
<details>
<summary>
:computer:&nbsp;&nbsp;&nbsp;&nbsp; <strong>TODO: SOFTWARE TO DELIVER IN THIS SECTION</strong>
</summary>

<bloquote>
<strong>The code repository must contain: </strong>
<ol>
<li>The ORM models and functions</li>
<li>A <var>.sql dump</var> of a database or the <var>.db file</var> (if you are using SQlite). You must provide a populated database in order to test your models.</li>
<li>The scripts used to generate your database (if any)</li>
<li>If you are using python, the requirements.txt file.</li> 

<li>A README.md file containing:
	<ul>
		<li>All dependencies (external libraries) and how to install them</li>
		<li>Define database and version utilized</li>
		<li>Instructions how to setup the database framework and external libraries you might have used, or a link where it is clearly explained. </li>
		<li>Instructions on how to setup and populate the database.</li>
		<li>Instruction on how to run the tests of your database.</li>
	</ul>
</li>
<li> If you are using python a `requirements.txt` with the dependencies</li>
</ol>

<strong>NOTE</strong>: Your code MUST be clearly documented.  Check Exercise 1 for examples on how to document the code.

<strong> In addition, it should be clear which is the code you have implemented yourself and which is the code that you have borrowed from other sources.</strong>

</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 4.5 points)</strong>
</summary>

<bloquote>
<ul>
	<li>Instructions to set up the database and run the tests are provided in the README.md file: <strong>0.5</strong>
		<ul>
			<li>this means there should be no undocumented extra steps in running the code/tests!</li>
		</ul>
	</li>
	<li>Table in the previous section covers all implemented models: <strong>0.25</strong></li>
	<li>All properties of the table in the previous section are implemented correctly in the model (using correct types...): <strong>0.75</strong></li>
	<li>The code has clear structure and naming for variables and methods: <strong>1.0</strong></li>
	<li>Each method's implemented in the model  functionality and input parameters are described in its documentation: <strong>0.5</strong></li>
	<li>Return value(s) (name, type, description for each) are documented: <strong>0.5</strong></li>
	<li>Exceptions (type, what causes it) are documented: <strong>0.5</strong></li>
	<li>Code documentation uses a consistent and clear format: <strong>0.5</strong>
		<ul>
		<li>you can use an existing documenting format (e.g. Sphinx for Python) or simply come up with your own - as long as it's consistent</li>
		</ul>
	</li>
</ul>
</bloquote>

</details>

---
:pencil2: *You do not need to write anything in this section, just complete the implementation.*

### Database testing
---
<details>
<summary>
:computer:&nbsp;&nbsp;<strong>Software that must be included in the section</strong>
</summary>

<bloquote>
<p>
In this course, showing that your code works is primarily your responsibility. Therefore we expect test cases that show that all of your methods work not just with correct parameters, but that they also handle error situations correctly. Tests should always cover the most common error scenarios that are easy to predict (e.g. trying to edit something that doesn't exist, trying to create duplicate primary keys etc.) Each test case has to clearly show what it tests, what test parameters it uses and finally to show that result was as expected.
</p>
<p>You should follow the testing methodologies shown in Exercise 1.</p>
<p>Some guidelines for the testing:</p>
<ul>
		<li>The code of the test MUST be commented indicating what are you testing in each case.</li>
		<li>For each model the test script should, at least:
			<ul>
				<li>Create a new instance of the model</li>
				<li>Retrieve an existing instance of the model (recommended trying with different filter options)</li>
				<li>Update an existing model instance (if update operation is supported by this model)</li>
				<li>Remove an existing model from the database</li>
                                <li>Test possible errors conditions (e.g. breaking foreign keys relations)</li>
			</ul>
		</li>
</ul>

<li>We recommend to include a set of scripts to setup your database and run your test.</li>
</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 2.5 points)</strong>
</summary>

<bloquote>
In this section you can get a maximum of 2.5 points.
<ul>
<li>The test case cover all models in the database: <strong>1.0</strong> (<i>0.5</i> if not all methods covered / <i>0</i> if just a few methods covered)
	<ul>
		<li>For each model the script should, at least:
			<ul>
				<li>Create a new instance of the model</li>
				<li>Retrieve an existing instance of the model (recommended trying with different filter options)</li>
				<li>Update an existing model instance (if update operation is supported by this model)</li>
				<li>Remove an existing model from the database</li>
			</ul>
		</li>
		<li>You should try to force errors (for instance, try to break foreign keys relations)</li>
	</ul>
</li>
<li>Test cases cover also errors scenarios: <strong>0.5</strong></li>
<li>The model implementation do not have errors : <strong>1.0</strong></li>
</ul>

</bloquote>

</details>

:pencil2: *You do not need to write anything here. Just complete the implementation*

---
## Resources allocation 
|**Task** | **Student**|**Estimated time**|
|:------: |:----------:|:----------------:|
|||| 
|||| 
|||| 
|||| 
|||| 