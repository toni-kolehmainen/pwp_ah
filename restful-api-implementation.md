# Important information for Deadline 4

:bangbang:&nbsp;&nbsp;**This chapter should be completed by Deadline 4** *(see course information at [Lovelace](http://lovelace.oulu.fi))*

---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Chapter summary</strong>
</summary>

<bloquote>
In this section you must implement the RESTful API designed in the previous section. <strong>The minimum requirements are summarized in the&nbsp;<a href="">Minimum Requirements</a>&nbsp;section of the Project Work Assignment. If you do not meet the minimum requirements this section WILL NOT be evaluated. </strong>
<h3>CHAPTER GOALS</h3>
<ul>
<li>Implement a RESTful API</li>
<li>Write tests for the API</li>
</ul>
</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Chapter evaluation (max 20 points)</strong>
</summary>

<bloquote>
You can get a maximum of 20 points after completing this section. More detailed evaluation is provided after each heading.
</bloquote>

</details>

---

# RESTful API implementation

## List of implemented resources

---
<details>
<summary>
:bookmark_tabs:&nbsp;&nbsp;<strong>Content that must be included in the section</strong>
</summary>

<bloquote>
A list of all implemented resources. Consider that not all resources that you have designed must be implemented.&nbsp; The minimum requirements are summarized in the Minimum requirements section from the Project work assignment. <em>You can use a table similar to the one you used to explain the uniform interface. <em>Do not forget to include in the <a href="doc/README.md">README.md</a> file which is the path to access to your application remotely.</em>

</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 1.0 points)</strong>
</summary>

<bloquote>
	In this section you can get a maximum of 1.0 points.
	<ul>
		<li>The table clearly shows which resources are implemented, and what requests they support: <strong>1.0</strong></li>
	</ul>
</bloquote>

</details>

---

:pencil2: *Write here your text*

## Resources implementation
<details>
<summary>
:computer:&nbsp;&nbsp;&nbsp;&nbsp; <strong>TODO: SOFTWARE TO DELIVER IN THIS SECTION</strong>
</summary>

<bloquote>
<strong>The code repository must contain: </strong>
<ol>
	<li>The source code for the RESTful API&nbsp;</li>
	<li>The external libraries that you have used</li>
	<li>We recommend to include a set of scripts to setup and run your server </li>
	<li>A database file or the necessary files and scripts to automatically populate your database.</li>
	<li>A <a href="documents/README.md">README.md</a> file containing:
		<ul>
			<li>Dependencies (external libraries)</li>
			<li>How to setup the framework.</li>
			<li>How to populate and setup the database.</li>
			<li>How to setup (e.g. modifying any configuration files) and run your RESTful API.</li>
			<li>The URL to access your API (usually <em>nameofapplication/api/version/</em>)=&gt; the path to your application.</li>
		</ul>
	</li>
</ol>
<strong>NOTE: Your code MUST be clearly documented. </strong>For each public method/function you must provide: a short description of the method, input parameters, output parameters, exceptions (when the application can fail and how to handle such fail). Check Exercise 2 and 3 for examples on how to document the code.
&nbsp;<strong>In addition should be clear which is the code you have implemented yourself and which is the code that you have borrowed from other sources</strong>
</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 4.5 points)</strong>
</summary>

<bloquote>
In this section you can get a maximum of <strong>4.5</strong> points:

<ul>
	<li>Instructions to set up the API and run the tests are provided in the <a href="http://readme.md/">README.md</a> file: <strong>1.0</strong>
		<ul>
			<li>this means there should be no undocumented extra steps in running the code/tests!</li>
		</ul>
	</li>
	<li>The code has clear structure and naming for variables and methods: <strong>1.0</strong></li>
	<li>You have clearly marked which parts of the code are your own work and which have been borrowed: <strong>0.5</strong></li>
	<li>Each method's functionality is described in its documentation: <strong>1.0</strong></li>
	<li>Parameters read from the request are described: <strong>0.5</strong></li>
	<li>Responses are briefly described (refer to your API documentation): <strong>0.5</strong></li>
</ul>
</bloquote>

</details>

---
:pencil2: *You do not need to write anything in this section, just complete the implementation.*

### RESTful API testing
<details>
<summary>
:computer:&nbsp;&nbsp;&nbsp;&nbsp; <strong>TODO: SOFTWARE TO DELIVER IN THIS SECTION</strong>
</summary>

<bloquote>
<strong>The code repository must contain: </strong>
<ol>
	<li>The code to test your RESTful API (Functional test)
		<ul>
			<li>The code of the test MUST be commented indicating what you are going to test in each test case.</li>
			<li>The test must include values that force error messages</li>
		</ul>
	</li>
	<li>The external libraries that you have used</li>
	<li>We recommend to include a set of scripts to execute your tests.</li>
	<li>A database file or the necessary files and scripts to automatically populate your database.</li>
	<li>A <a href="documents/README.md">README.md</a> file containing:
		<ul>
			<li>Dependencies (external libraries)</li>
			<li>Instructions on how to run the different tests for your application.</li>
		</ul>
	</li>
</ol>
Do not forget to include in the <a href="doc/README.md">README.md</a> the instructions on how to run your tests. Discuss briefly which were the main errors that you detected thanks to the functional testing.

Remember that you MUST implement a functional testing suite. A detailed description of the input / output in the a REST client plugin.

As with the database tests, in this section it is your responsibility that your API handles requests correctly. All of the example requests in your API documentation should work, and your API must give the responses from your documentation. You also need to show that invalid requests are properly handled, and that the responses match those in the documentation.
</bloquote>

</details>

---

---
<details>
<summary>
:heavy_check_mark:&nbsp;&nbsp;&nbsp;&nbsp; <strong>Evaluation criteria(max 14.5 points)</strong>
</summary>

<bloquote>
In this section you can get a maximum of <strong>14.5</strong> points:

<ul>
	<li>Test cases run correctly: <strong>1.0</strong></li>
	<li>Each method is tested with correct requests: <strong>2.0</strong></li>
	<li>Test cases cover all predictable error scenarios (various invalid requests) for all methods:<strong>4.0</strong></li>
	<li>Test output clearly describes the testing process for each case: <strong>3.5</strong></li>
	<li>The interface works as intended (i.e. we don't find any errors. ) Errors will diminish this grade.: <strong>4.0</strong></li>
	<li>NOTE: In group with 4 people we will be more strict when assigning grades in this section.</li>
</ul>
</bloquote>

</details>

---
:pencil2: *You do not need to write anything in this section, just complete the implementation.*

## Resources allocation
|**Task** | **Student**|**Estimated time**|
|:------: |:----------:|:----------------:|
|||| 
|||| 
|||| 
|||| 
|||| 