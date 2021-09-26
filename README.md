# knn-js
* Clickable/Interactive [k-NN algorithm](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) in javascript 
* It can be integrated into a web application
* It is based on [d3](https://d3js.org/)

# Setup

Include the libraries

```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="../dist/knnjs.min.js"></script>
<link rel="stylesheet" href="../dist/knnjs.min.css" />
```

## CDN - UNPKG
* TODO

# Usage
## Hello World example
Create an element to hold the table

```html
<div id="myknn"></div>
```

Turn the div element into a d3 scatter chart with some simple javascript

```javascript
var myknn = knnjs.knn();
myknn.init(document.getElementById("myknn"), {
  selectedDataSet: [
    {age: 37, year_of_operation: 63, positive_axillary_nodes: 0, survival_status: 1},
    {age: 43, year_of_operation: 58, positive_axillary_nodes: 52, survival_status: 2},
    {age: 43, year_of_operation: 59, positive_axillary_nodes: 2, survival_status: 2},
    {age: 43, year_of_operation: 63, positive_axillary_nodes: 14, survival_status: 1},
    {age: 43, year_of_operation: 64, positive_axillary_nodes: 2, survival_status: 1},
    {age: 46, year_of_operation: 65, positive_axillary_nodes: 20, survival_status: 2},
    {age: 48, year_of_operation: 66, positive_axillary_nodes: 0, survival_status: 1},
    {age: 50, year_of_operation: 61, positive_axillary_nodes: 0, survival_status: 1},
    {age: 54, year_of_operation: 62, positive_axillary_nodes: 0, survival_status: 1},
    {age: 58, year_of_operation: 61, positive_axillary_nodes: 2, survival_status: 1}
  ], 
  colorMap: {
    "1": "#EE7733",
    "2": "#0077BB"
  },
  selectedColumns: ["age", "year_of_operation"], 
  categoryName: "survival_status"
});
```

![hello](imgs/hello.png)

Take a look at [examples/hello.html](https://github.com/study-ml/knn-js/blob/main/examples/hello.html) for more information

## Work with the [chart table](https://github.com/study-ml/chart-table)

Include the libraries

```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="../dist/knnjs.min.js"></script>
<script src="../dist/charttable.min.js"></script>
<link rel="stylesheet" href="../dist/knnjs.min.css"></link>
<link rel="stylesheet" href="../dist/charttable.min.css"></link>
```

Create div elements to hold the table

```html
<div id="mytable"></div>
<div id="myknn"></div>
```

Work with [chart table](https://github.com/study-ml/chart-table)

```javascript
const mytable = charttable.table();
const myknn = knnjs.knn();
const tol_vibrant = ["#EE7733", "#0077BB", "#33BBEE", "#EE3377", "#CC3311", "#009988"];
mytable.initTbl(document.getElementById("mytable"), {
  colors: tol_vibrant,
  minSelectedRow2Show: 4,
  minSelectedCol2Show: 2,
  height: 540,
  onSelect: function(data) {
    myknn.init(document.getElementById("myknn"), {
      colorMap: data.selectedColorMap,
      selectedDataSet: data.selectedRows, 
      selectedColumns: data.selectedColumns, 
      categoryName: data.categoryName
    });
  }
});

mytable.showDataset([
  {age: 30, year_of_operation: 65, positive_axillary_nodes: 0, survival_status: 1},
  {age: 38, year_of_operation: 66, positive_axillary_nodes: 0, survival_status: 1},
  {age: 42, year_of_operation: 59, positive_axillary_nodes: 0, survival_status: 2},
  {age: 49, year_of_operation: 63, positive_axillary_nodes: 0, survival_status: 2},
  {age: 49, year_of_operation: 61, positive_axillary_nodes: 0, survival_status: 1},
  {age: 55, year_of_operation: 66, positive_axillary_nodes: 18, survival_status: 1},
  {age: 56, year_of_operation: 60, positive_axillary_nodes: 0, survival_status: 1},
  {age: 61, year_of_operation: 65, positive_axillary_nodes: 0, survival_status: 2},
  {age: 61, year_of_operation: 59, positive_axillary_nodes: 0, survival_status: 1},
  {age: 64, year_of_operation: 66, positive_axillary_nodes: 0, survival_status: 1}
]);
```

![charttable](imgs/charttable.png)

# TODO
* use `webpack` to build
* publish to npm and `CDN - UNPKG`
* remove `charttable.min.js` once we can publish to npm
 
