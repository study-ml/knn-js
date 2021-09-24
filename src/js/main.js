exports.knn = function() {
  const gRadius = 5;
  var gColors = null;
  var gHeight = null;
  var gWidth = null;

  function getVotingResult(chunks) {
    var max = 0;
    Object.keys(chunks).forEach(function(key) {
      max = Math.max(chunks[key], max);
    });
    
    var count = 0;
    var res = null;
    Object.keys(chunks).forEach(function(key) {
      if (chunks[key] == max) {
        res = key;
        count += 1;
      }
    });

    // console.log(`duplicated count: ${count}`);
    if (count > 1) {
      return null;
    } else {
      return res;
    }
  }

  function getOffset(id) {
    const ele = document.getElementById(id);
    const rect = ele.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  function l2distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  function knn(xTarget, yTarget, dataset, k, xColName, yColName, clsName) {
    const subset = dataset.map(function(ele) {
      return { 
        "s": ele[clsName],
        "x": ele[xColName], 
        "y": ele[yColName],
        "d": l2distance(xTarget, yTarget, ele[xColName], ele[yColName]) 
      } 
    });

    const topValues = subset.sort((a,b) => a["d"]-b["d"]).slice(0, k);
    // console.log(topValues);

    const chunks = topValues.reduce((total, curr) => {
      if (total.hasOwnProperty(curr["s"])) {
        total[curr["s"]] += 1;
      } else {
        total[curr["s"]] = 1;
      }
      return total;
    }, {});
    
    // console.log(chunks);
    return { 
      "votes": getVotingResult(chunks),
      "candidates": topValues
    };
  }

  function drawDecisionBoundry(svg, x, y, xMinVal, xMaxVal, yMinVal, yMaxVal, data, colorMap, xColName, yColName, clsName, step) {
    const scale = 5.5;
    for (var w=xMinVal-step; w<xMaxVal+step; w+=step/scale) {
      for (var h=yMinVal-step; h<yMaxVal+step; h+=step/scale) {
        svg.append("g")
          .append("circle")
          .attr("cx", function (d) { return x(w); } )
          .attr("cy", function (d) { return y(h); } )
          .attr("r", 2)
          .attr("class", "knnjs-boundary")
          .style("fill", function(d) {
            const res = knn(w, h, data, parseInt(document.getElementById("kvalue").value), xColName, yColName, clsName);
            // console.log(res);
            if (colorMap.hasOwnProperty(res["votes"])) {
              return colorMap[res["votes"]];
            } else {
              return "black";
            }
          });
      }
    }
  }

  function drawTrainingData(svg, x, y, data, colorMap, xColName, yColName, clsName) {
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d[xColName]); } )
      .attr("cy", function (d) { return y(d[yColName]); } )
      .attr("r", gRadius)
      .style("fill", function(d) {
        if (colorMap.hasOwnProperty(d[clsName])) {
          return colorMap[d[clsName]];
        } else {
          return "black";
        }
      });
  }

  function buildColorMap() {
    var idx = 0;
    return gSelectedDataSet.reduce((total, curr) => {
      if (!total.hasOwnProperty(curr[gClsName])) {
        total[curr[gClsName]] = gColors[idx];
        idx += 1;
      }
      return total;
    }, {});
  }

  function drawLegend(colorMap) {
    var legend = document.getElementById('legend');

    Object.keys(colorMap).forEach(function(key) {
      var dt = document.createElement("div");
      dt.setAttribute("style", `float: left; width: 20px; height: 20px; vertical-align: middle; background: ${colorMap[key]}`);
      legend.appendChild(dt);
      
      var dd = document.createElement("div");
      dd.innerText = key;
      legend.appendChild(dd);
    });
  }

  function toggleDecisionBoundary() {
    var boundary = document.querySelectorAll('.knnjs-boundary');
    for (var i = 0; i<boundary.length; i++) {
      if (boundary[i].style.fillOpacity == "0" || boundary[i].style.fillOpacity == "") {
        boundary[i].style.fillOpacity = "1";
      } else {
        boundary[i].style.fillOpacity = "0";
      }
    }
  }

  function buildKnnHtml(td) {
    var divBtn = document.createElement("div");
    var btn = document.createElement("button");
    btn.addEventListener('click', function() {
      toggleDecisionBoundary();
    });
    btn.innerText = "Show/Hide Decision Boundary";
    divBtn.appendChild(btn);

    var select = document.createElement("select");
    select.setAttribute("name", "kvalue");
    select.setAttribute("id", "kvalue");
    var opt1 = document.createElement("option");
    opt1.innerText="3";
    select.appendChild(opt1);
    var opt2 = document.createElement("option");
    opt2.innerText="4";
    select.appendChild(opt2);
    var opt3 = document.createElement("option");
    opt3.innerText="5";
    select.appendChild(opt3);
    select.addEventListener('change', function() {
      initInternal();
    });

    var label = document.createElement("label");
    label.setAttribute("for", "kvalue");
    label.innerText = "Choose a value for K:";

    var divDl = document.createElement("div");
    var dl = document.createElement("dl");
    dl.setAttribute("id", "legend");
    dl.setAttribute("class", "knnjs-dl");
    divDl.appendChild(dl);

    var divCand = document.createElement("div");
    divCand.setAttribute("id", "cand");
    
    td.appendChild(label);
    td.appendChild(select);
    td.appendChild(divDl);
    td.appendChild(divBtn);
    td.appendChild(document.createElement("hr"));
    td.appendChild(divCand);

    // return `
    //     <label for="kvalue">Choose a value for K: </label>
    //     <select name="kvalue" id="kvalue" onchange="">
    //       <option>3</option>
    //       <option>4</option>
    //       <option>5</option>
    //     </select>
    //     <div>
    //       <dl class="knnjs-dl" id="legend">
    //       </dl>
    //     </div>
    //     ${outerHTML(divBtn)}
    //     <hr>
    //     <div id="cand">
    //     </div>
    //   `;
  }

  function buildTable() {
    var table = document.createElement("table");
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var divViz = document.createElement("div");
    divViz.setAttribute("id", "knn-data-vis");

    buildKnnHtml(td2);
    td1.appendChild(divViz);
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);

    return table;
  }

  let publicScope = {};
  publicScope.init = function(ele, options) {
    var extend = function(a, b){
      for (var key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    }

    options = extend({
      colors: ["#FFB000", "#DC267F", "#648FFB", "#785EF0"],
      height: 640,
      width: 690,
      selectedDataSet: null, 
      selectedColumns: null, 
      clsName: null,
      onSelect: null,
    }, options);

    gColors = options.colors;
    gOnSelect = options.onSelect;
    gHeight = options.height;
    gWidth = options.width;
    gSelectedDataSet = options.selectedDataSet; 
    gSelectedColumns = options.selectedColumns;
    gClsName = options.clsName;

    ele.appendChild(buildTable());
    initInternal();
  }

  function initInternal() {
    const xColName = gSelectedColumns[0];
    const yColName = gSelectedColumns[1];
    // console.log(xColName);
    // console.log(yColName);
    // console.log(gClsName);
    
    // reset everything
    d3.select('div#knn-data-vis > *').remove();
    var cand = document.getElementById('cand');
    while(cand.firstChild) {
      cand.removeChild(cand.firstChild);
    }

    var legend = document.getElementById('legend');
    while(legend.firstChild) {
      legend.removeChild(legend.firstChild);
    }

    // margin is for legends
    var margin = {top: 10, right: 30, bottom: 40, left: 60},
        width = gWidth - margin.left - margin.right,
        height = gHeight - margin.top - margin.bottom;

    var svg = d3.select("#knn-data-vis")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const xMinVal = Math.min(...gSelectedDataSet.map(ele => ele[xColName]));
    const xMaxVal = Math.max(...gSelectedDataSet.map(ele => ele[xColName]));

    const yMinVal = Math.min(...gSelectedDataSet.map(ele => ele[yColName]));
    const yMaxVal = Math.max(...gSelectedDataSet.map(ele => ele[yColName]));
    const step = Math.max(xMaxVal - xMinVal, yMaxVal - yMinVal) / 7.0;
    
    var x = d3.scaleLinear()
      .domain([xMinVal - step, xMaxVal + step])
      .range([0, width]);
    
    svg.append("g").attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("text")             
      .attr("transform", `translate(${width / 2}, ${(height + margin.top + 20)})`)
      .style("text-anchor", "middle")
      .text(xColName);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yColName);
  
    var y = d3.scaleLinear()
      .domain([yMinVal - step, yMaxVal + step])
      .range([height, 0]);
    
    svg.append("g")
      .call(d3.axisLeft(y));

    const colorMap = buildColorMap();
    
    drawLegend(colorMap);
    drawDecisionBoundry(svg, x, y, xMinVal, xMaxVal, yMinVal, yMaxVal, gSelectedDataSet, colorMap, xColName, yColName, gClsName, step);
    drawTrainingData(svg, x, y, gSelectedDataSet, colorMap, xColName, yColName, gClsName);
    
    const div = getOffset("knn-data-vis");
    d3.select('#knn-data-vis').on("click", function() {
      const yDot = y.invert(d3.event.pageY - div.top - margin.top);
      const xDot = x.invert(d3.event.pageX - div.left - margin.left);
      
      // console.log(`y is ${yDot}`);
      // console.log(`x is ${xDot}`);

      var candidates = null;
      svg.append("g")
        .append("circle")
        .attr("cx", function (d) { return x(xDot); } )
        .attr("cy", function (d) { return y(yDot); } )
        .attr("r", 5)
        .style("stroke", "black")
        .style("fill", function(d) {
          const res = knn(xDot, yDot, gSelectedDataSet, parseInt(document.getElementById("kvalue").value), xColName, yColName, gClsName);
          candidates = res["candidates"];
          // console.log(res);
          if (colorMap.hasOwnProperty(res["votes"])) {
            return colorMap[res["votes"]];
          } else {
            return "black";
          }
        });
      
      while (cand.firstChild) {
        cand.removeChild(cand.firstChild);
      }
      var titleDiv = document.createElement("div");
      titleDiv.innerText = "nearest neighbors:";
      cand.appendChild(titleDiv);
      
      for (var c=0; c<candidates.length; c++) {
        var candDiv = document.createElement("div");
        candDiv.setAttribute("style", `background: ${colorMap[candidates[c]["s"]]}`);
        candDiv.innerText = `${candidates[c]["s"]}, x: ${candidates[c]["x"]}, y: ${candidates[c]["y"]}`;
        cand.appendChild(candDiv);
        
        svg.append("line")
          .attr("x1", x(xDot))
          .attr("x2", x(candidates[c]["x"]))
          .attr("y1", y(yDot))
          .attr("y2", y(candidates[c]["y"]))
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .transition().duration(2000)
          .style("opacity", 0.0);
      }
    });
  }

  return publicScope;
}
