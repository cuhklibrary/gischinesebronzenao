var imageContainerMargin = 70;  // Margin + padding

// This watches for the scrollable container
var scrollPosition = 0;
$('div#contents').scroll(function() {
  scrollPosition = $(this).scrollTop();
});

var map = null;
var geojson = null;

function initMap() {

  // This creates the Leaflet map with a generic start point, because code at bottom automatically fits bounds to all markers
  map = L.map('map', {
    center: [0, 0],
    zoom: 5,
    scrollWheelZoom: true
  });

  // This displays a base layer map (other options available)
//  var lightAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//  }).addTo(map);
	
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	maxZoom: 17,
}).addTo(map);

  // This loads the GeoJSON map data file from a local folder
  $.getJSON('storymap.json', function(data) {
    geojson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        (function(layer, properties) {
          // This creates numerical icons to match the ID numbers
          // OR remove the next 6 lines for default blue Leaflet markers
          var numericMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: feature.properties['id'],
            markerColor: 'blue'
          });
          layer.setIcon(numericMarker);

          // This creates the contents of each item from the GeoJSON data. Unwanted items can be removed, and new ones can be added
          var item = $('<p></p>', {
            text: feature.properties['id'],
            class: 'item-header'
          });

          //var image = $('<img>', {
          //  src: feature.properties['image'],
          //});

          var source = $('<a>', {
            text: feature.properties['source-credit'],
            href: feature.properties['source-link'],
            target: "_blank",
            class: 'source'
          });
		  
		  var province = $('<p></p>', {
            text: feature.properties['省'],
            class: 'province'
          });

          var site = $('<p></p>', {
            text: feature.properties['遺址'],
            class: 'site'
          });
		  
		  var site_no = $('<p></p>', {
            text: feature.properties['墓地編號'],
            class: 'site_no'
          });
		  
		  var count = $('<p></p>', {
            text: feature.properties['出土鐃數量'],
            class: 'count'
          });
		  
		  var inscriptions = $('<p></p>', {
            text: feature.properties['銘文'],
            class: 'inscriptions'
          });
		  
		  var height = $('<p></p>', {
            text: feature.properties['高度 (厘米)'],
            class: 'height'
          });
		  
		  var reference = $('<p></p>', {
            text: feature.properties['參考資料'],
            class: 'reference'
          });
		  
		  var quot = $('<p></p>', {
            text: feature.properties['原文節錄'],
            class: 'quot'
          });
		  
		  var spacer = $('<p></p>', {
			text: ' ',
            class: 'spacer'
          });

          var container = $('<div></div>', {
            id: 'container' + feature.properties['id'],
            class: 'image-container'
          });

          //var imgHolder = $('<div></div', {
          //  class: 'img-holder'
          //});

          //imgHolder.append(image);

          //container.append(item).append(imgHolder).append(source).append(description);
		  container.append(item).append(source).append(province).append(site).append(site_no).append(count).append(inscriptions).append(height).append(reference).append(quot).append(spacer);
          $('#contents').append(container);

          var i;
          var areaTop = -100;
          var areaBottom = 0;

          // Calculating total height of blocks above active
          for (i = 1; i < feature.properties['id']; i++) {
            areaTop += $('div#container' + i).height() + imageContainerMargin;
          }

          areaBottom = areaTop + $('div#container' + feature.properties['id']).height();

          $('div#contents').scroll(function() {
			if ($(this).scrollTop() >= areaTop && $(this).scrollTop() < areaBottom) {
			  $('.image-container').removeClass("inFocus").addClass("outFocus");
			  $('div#container' + feature.properties['id']).addClass("inFocus").removeClass("outFocus");

			  map.flyTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0] ], feature.properties['zoom']);
			}
          });

          // Make markers clickable
          layer.on('click', function() {
			$("div#contents").animate({scrollTop: areaTop + imageContainerMargin});
		  });
        
		})(layer, feature.properties);
      }
    });

    $('div#container1').addClass("inFocus");
    $('#contents').append("<div class='space-at-the-bottom'><a href='#space-at-the-top'><i class='fa fa-chevron-up'></i></br><small>Top</small></a></div>");
    map.fitBounds(geojson.getBounds());
    geojson.addTo(map);
  });
}

function home()
{
	location.href = "index.html";
}

initMap();
