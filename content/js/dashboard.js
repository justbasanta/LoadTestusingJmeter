/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8177083333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://www.daraz.com.np/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-9"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-15"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-6"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-10"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://member.daraz.com.np/user/api/login"], "isController": false}, {"data": [1.0, 500, 1500, "https://my.daraz.com.np/api/recentOrders/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-16"], "isController": false}, {"data": [1.0, 500, 1500, "https://cart.daraz.com.np/cart/api/count"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-24"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/-23"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/-22"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-22"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/-21"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-21"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-14"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/catalog/?ajax=true&m=clicktrace&q=t-blade-blade&trace=query%3Aapple%3Bnid%3A105294148%3Bsrc%3ALazadaMainSrp%3Brn%3A733399e1a23595858c89088dea97ae0e%3Bregion%3Anp%3Bsku%3A105294148_NP%3Bprice%3A139000%3Bclient%3Adesktop%3Bsupplier_id%3A1000763%3Basc_category_id%3A3%3Bitem_id%3A105294148%3Bsku_id%3A1026978806%3Bshop_id%3A10717"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-16"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://member.daraz.com.np/user/api/getContextInfo"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://member.daraz.com.np/user/api/getUser"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-19"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-16"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://pdpdesc-m.daraz.com.np/recommend?shop_id=10717&search=1&category_id=3&item_id=105294148&user_id=900001902431&regional_key=010100000000&is_ab=true&sku=105294148_NP-1026978806&seller_id=1000763&is_tbc=0&_=1626760723623&brand_id=4178"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-21"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-22"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-23"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-24"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-25"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://member.daraz.com.np/user/api/getCsrfToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://acs-m.daraz.com.np/h5/mtop.alibaba.global.holmes.customevent.upload/1.0/?jsv=2.4.5&appKey=30133426&t=1626760725146&sign=24eebc1d0202c1ee0bded7cadaebfe21&api=mtop.alibaba.global.holmes.customEvent.upload&v=1.0&type=originaljson&isSec=1&AntiCreep=true&timeout=20000&needLogin=true&dataType=json&sessionOption=AutoLoginOnly&x-i18n-language=en-NP&x-i18n-regionID=NP&ext_headers=%5Bobject%20Object%5D"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.np/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.np/-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 95, 0, 0.0, 541.7157894736844, 14, 4364, 229.0, 1641.8000000000009, 2550.0, 4364.0, 3.4760336626417856, 569.7325297864069, 4.376021942462495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.daraz.com.np/-4", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 92.4445950255102, 6.0786033163265305], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1", 1, 0, 0.0, 3314.0, 3314, 3314, 3314.0, 3314.0, 3314.0, 3314.0, 0.30175015087507545, 959.6839402911888, 5.189277496982498], "isController": false}, {"data": ["https://www.daraz.com.np/-3", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 401.0719476744186, 1.6427446705426356], "isController": false}, {"data": ["https://www.daraz.com.np/-6", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 6.325206537356322, 1.111260775862069], "isController": false}, {"data": ["https://www.daraz.com.np/-5", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 241.37736133440515, 1.9123040594855305], "isController": false}, {"data": ["https://www.daraz.com.np/-8", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 66.6082974137931, 1.600837201591512], "isController": false}, {"data": ["https://www.daraz.com.np/-7", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 23.006244297445253, 2.1740989963503647], "isController": false}, {"data": ["https://www.daraz.com.np/-9", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 88.64739138176638, 1.719417735042735], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49", 1, 0, 0.0, 4364.0, 4364, 4364, 4364.0, 4364.0, 4364.0, 4364.0, 0.22914757103574704, 657.0712613141613, 3.5188921431026583], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-9", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 414.7423169889503, 3.296572859116022], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-15", 1, 0, 0.0, 1289.0, 1289, 1289, 1289.0, 1289.0, 1289.0, 1289.0, 0.7757951900698216, 425.0713670965865, 0.4810839313421257], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-14", 1, 0, 0.0, 1469.0, 1469, 1469, 1469.0, 1469.0, 1469.0, 1469.0, 0.6807351940095302, 146.70774123553437, 0.3855726684819605], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-7", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 183.64823631974247, 2.891966201716738], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-13", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 136.95342781007753, 4.413456879844961], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-8", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 55.24128239329268, 3.644245426829268], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-12", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 1.7039331896551726, 4.855872844827586], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-5", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 290.8129953170029, 0.987819704610951], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-11", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 8.145960365853659, 15.767911585365853], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-6", 1, 0, 0.0, 2399.0, 2399, 2399, 2399.0, 2399.0, 2399.0, 2399.0, 0.41684035014589416, 379.7969205919133, 0.2462777459358066], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-10", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.7723329344624447, 0.9291006995581738], "isController": false}, {"data": ["Test", 1, 0, 0.0, 16040.0, 16040, 16040, 16040.0, 16040.0, 16040.0, 16040.0, 0.062344139650872814, 486.72088090321074, 4.213891540679551], "isController": true}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-3", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 255.91730667372883, 5.337989936440678], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-4", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 1.8971824408468243, 0.7017142745952677], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 16.845703125, 32.080078125], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-2", 1, 0, 0.0, 856.0, 856, 856, 856.0, 856.0, 856.0, 856.0, 1.1682242990654206, 283.8089131863318, 0.7267176547897196], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-0", 1, 0, 0.0, 1922.0, 1922, 1922, 1922.0, 1922.0, 1922.0, 1922.0, 0.5202913631633715, 150.49072011576484, 0.38818613423517173], "isController": false}, {"data": ["https://member.daraz.com.np/user/api/login", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 1.4051011029411764, 2.4724264705882355], "isController": false}, {"data": ["https://my.daraz.com.np/api/recentOrders/", 3, 0, 0.0, 200.0, 100, 399, 101.0, 399.0, 399.0, 399.0, 0.1456593513303554, 0.1602158034327054, 0.09293370071858613], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-19", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 296.472382127193, 2.694113212719298], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-18", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 5.859375, 11.341831140350877], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-17", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 5.56640625, 10.774739583333334], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-16", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 93.88809974747474, 6.046796085858586], "isController": false}, {"data": ["https://cart.daraz.com.np/cart/api/count", 3, 0, 0.0, 210.33333333333334, 103, 425, 103.0, 425.0, 425.0, 425.0, 0.14634146341463414, 0.13247903963414634, 0.08627096036585366], "isController": false}, {"data": ["https://www.daraz.com.np/-24", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 105.00081380208333, 6.022135416666667], "isController": false}, {"data": ["https://www.daraz.com.np/-23", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 375.1400089605734, 2.541162634408602], "isController": false}, {"data": ["https://www.daraz.com.np/-22", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 297.70343223314603, 2.8656805945692883], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-22", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 31.529017857142858, 6.428142170329671], "isController": false}, {"data": ["https://www.daraz.com.np/-21", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 309.5058765579179, 3.6026851173020527], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-21", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 86.01326778017241, 5.0006734913793105], "isController": false}, {"data": ["https://www.daraz.com.np/-20", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 112.02315596846847, 5.190737612612613], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?q=apple&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.287d2d2bzDbp49-20", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 418.2749965734649, 3.510056880482456], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-10", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 213.2623845880682, 1.6951127485795456], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-11", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.02476472007722, 2.4357504826254828], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-12", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 2.693422379032258, 5.213583669354839], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-13", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.4118303571428572, 4.0234375], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-14", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 118.57041736577182, 3.8210465604026846], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-15", 1, 0, 0.0, 1736.0, 1736, 1736, 1736.0, 1736.0, 1736.0, 1736.0, 0.576036866359447, 124.16407150057604, 0.3262708813364055], "isController": false}, {"data": ["https://www.daraz.com.np/catalog/?ajax=true&m=clicktrace&q=t-blade-blade&trace=query%3Aapple%3Bnid%3A105294148%3Bsrc%3ALazadaMainSrp%3Brn%3A733399e1a23595858c89088dea97ae0e%3Bregion%3Anp%3Bsku%3A105294148_NP%3Bprice%3A139000%3Bclient%3Adesktop%3Bsupplier_id%3A1000763%3Basc_category_id%3A3%3Bitem_id%3A105294148%3Bsku_id%3A1026978806%3Bshop_id%3A10717", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 3.8658961776859506, 7.231404958677686], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-16", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 209.12427580758427, 1.8735735603932586], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-17", 1, 0, 0.0, 1579.0, 1579, 1579, 1579.0, 1579.0, 1579.0, 1579.0, 0.6333122229259025, 334.4946118983534, 0.3840692289423686], "isController": false}, {"data": ["https://member.daraz.com.np/user/api/getContextInfo", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 8.02313112745098, 4.509420955882353], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-18", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 173.1506719066937, 1.18653334178499], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-19", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 35.74969951923077, 2.302433894230769], "isController": false}, {"data": ["https://www.daraz.com.np/-15", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 243.84167729591834, 6.158322704081632], "isController": false}, {"data": ["https://member.daraz.com.np/user/api/getUser", 5, 0, 0.0, 106.2, 103, 115, 104.0, 115.0, 115.0, 115.0, 0.22953679474819813, 0.19515110694119267, 0.18546752341275305], "isController": false}, {"data": ["https://www.daraz.com.np/-14", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 157.65115489130434, 8.746603260869565], "isController": false}, {"data": ["https://www.daraz.com.np/-13", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 29.986915495110026, 1.4755883251833741], "isController": false}, {"data": ["https://www.daraz.com.np/-12", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 163.88721955128204, 7.7373798076923075], "isController": false}, {"data": ["https://www.daraz.com.np/-11", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 45.09442551691729, 2.268855733082707], "isController": false}, {"data": ["https://www.daraz.com.np/-10", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 179.1279269972452, 1.700241046831956], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-3", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 106.37555803571428, 42.34095982142857], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-4", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 455.34589213709677, 9.812878024193548], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-5", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 271.4092548076923, 22.38581730769231], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-6", 1, 0, 0.0, 1262.0, 1262, 1262, 1262.0, 1262.0, 1262.0, 1262.0, 0.7923930269413629, 159.92410360538827, 0.5432225633914421], "isController": false}, {"data": ["https://www.daraz.com.np/-19", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 187.9155585106383, 6.087932180851064], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-7", 1, 0, 0.0, 2550.0, 2550, 2550, 2550.0, 2550.0, 2550.0, 2550.0, 0.39215686274509803, 357.33455882352945, 0.23169424019607845], "isController": false}, {"data": ["https://www.daraz.com.np/-18", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 295.1265693231441, 2.673819596069869], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-8", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 191.8835832399103, 3.0216507847533634], "isController": false}, {"data": ["https://www.daraz.com.np/-17", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 84.2548076923077, 9.164663461538462], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-9", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 72.4765625, 4.78125], "isController": false}, {"data": ["https://www.daraz.com.np/-16", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 266.15084134615387, 22.911658653846153], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-20", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.930545520231214, 3.736903901734104], "isController": false}, {"data": ["https://pdpdesc-m.daraz.com.np/recommend?shop_id=10717&search=1&category_id=3&item_id=105294148&user_id=900001902431&regional_key=010100000000&is_ab=true&sku=105294148_NP-1026978806&seller_id=1000763&is_tbc=0&_=1626760723623&brand_id=4178", 2, 0, 0.0, 371.0, 310, 432, 371.0, 432.0, 432.0, 432.0, 2.092050209205021, 29.942468619246863, 2.821407557531381], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-21", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 2.08740234375, 4.04052734375], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-22", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 201.1776878720238, 1.8281482514880951], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-23", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 387.598053226626, 3.253223450203252], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-0", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 415.149078581363, 1.1286835013908205], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-24", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 52.5133634868421, 3.0530427631578947], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-1", 1, 0, 0.0, 1779.0, 1779, 1779, 1779.0, 1779.0, 1779.0, 1779.0, 0.5621135469364812, 175.23560462338392, 0.3403421866216976], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-25", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 17.71074459876543, 3.610869984567901], "isController": false}, {"data": ["https://www.daraz.com.np/products/apple-iphone-12-i105294148-s1026978806.html?spm=a2a0e.searchlist.list.2.3e4137e6eGdfVl&search=1-2", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 212.3355505601415, 1.4279923349056605], "isController": false}, {"data": ["https://member.daraz.com.np/user/api/getCsrfToken", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 7.79389880952381, 4.7898065476190474], "isController": false}, {"data": ["https://acs-m.daraz.com.np/h5/mtop.alibaba.global.holmes.customevent.upload/1.0/?jsv=2.4.5&appKey=30133426&t=1626760725146&sign=24eebc1d0202c1ee0bded7cadaebfe21&api=mtop.alibaba.global.holmes.customEvent.upload&v=1.0&type=originaljson&isSec=1&AntiCreep=true&timeout=20000&needLogin=true&dataType=json&sessionOption=AutoLoginOnly&x-i18n-language=en-NP&x-i18n-regionID=NP&ext_headers=%5Bobject%20Object%5D", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 2.44140625, 2.918061755952381], "isController": false}, {"data": ["https://www.daraz.com.np/", 1, 0, 0.0, 4260.0, 4260, 4260, 4260.0, 4260.0, 4260.0, 4260.0, 0.2347417840375587, 402.80177156690144, 4.56623202758216], "isController": false}, {"data": ["https://www.daraz.com.np/-0", 1, 0, 0.0, 2550.0, 2550, 2550, 2550.0, 2550.0, 2550.0, 2550.0, 0.39215686274509803, 188.58992034313727, 0.24280024509803924], "isController": false}, {"data": ["https://www.daraz.com.np/-2", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 228.47469124251495, 4.379912050898203], "isController": false}, {"data": ["https://www.daraz.com.np/-1", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 153.22440011160714, 5.275181361607142], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 95, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
