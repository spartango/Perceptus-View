var boxselector;
var boxes = {};

// Toggles the UI state of the draw-button
function toggleButton() {
     $('.btn-primary').toggleClass('btn-success');
}

// Makes boxes printable
function boxToString(box) {
    var p1 = map.locationPoint(box[0]);
    var p2 = map.locationPoint(box[1]);
    return p1.toString() +" "+ p2.toString();
}

// Adds box coordinates to list
function addBoxListing(owner, box) {
    var div = $('<div/>', {
        id : "coordinate" + owner.getId(),
        text: boxToString(box)
    });
    div.appendTo('#boxselector-text');
}

// Updates box coordinates in list
function updateBoxListing(owner, box) {
    var obj = $('#coordinate' + owner.getId());
    obj.text(boxToString(box));
}

// ------------------------------------------------------------------------
// ROI Drawing 

function renderROI(roi) {
    // Create a box selector
    var roiBox = new wax.mm.boxselector();
    roiBox.map(map);
    roiBox.add();
    roiBox.disable(); 
    roiBox.disableResize();

    // Offset the roi by the window offset
    var xOffset = 0;
    var yOffset = 0;

    var x = roi.x + xOffset;
    var y = roi.y + yOffset; 
    // Convert the ROI pixel values to a Location (lat, lon)
    var l1 = map.pointLocation(new MM.Point(x, y));
    var l2 = map.pointLocation(new MM.Point((x + roi.width), 
                                            (y + roi.height)));

    // Set the extent
    roiBox.extent([
        new MM.Location(
            Math.max(l1.lat, l2.lat),
            Math.min(l1.lon, l2.lon)),
        new MM.Location(
            Math.min(l1.lat, l2.lat),
            Math.max(l1.lon, l2.lon))
    ]);
    
}

// ------------------------------------------------------------------------
// Box Selector

// Handles draw button clicks
function onDrawButton() {
    // See if a new box-selector is needed (this selector has a box already)
    if(!boxselector || boxes[boxselector.getId()]) {
        // Create a new box-selector and allow for new Drawing
        createBoxSelector();
    }

    // Set the mode away from resizing
    toggleButton();
}

function initSessionVars() {
  if (typeof(Storage) !== "undefined") {
    if (!sessionStorage.indImagesSegmented) {
       sessionStorage.indImagesSegmented = 1;
    }
    $('.title').html('<h2>Segmenting image ' + sessionStorage.indImagesSegmented + '/10</h2>');
    $('.bar').width(sessionStorage.indImagesSegmented * 10 + '%');
  }
}

// Handles changes to a box, whether new or resizing
function onBoxChange(owner, box) {
    if(boxes[owner.getId()]) {
        // This is an update
        onBoxUpdate(owner.getId(), box);
    } else {
        // This is a new box
        onNewBox(owner.getId(), box);

        // Untoggle the draw button
        toggleButton();
    }
}

function onNewBox(id, box) {
    // Add a new model for this box, associating it with its owner id
    console.log("New box: "+box);

    // Get pixel coordinates
    var topLeft     = map.locationPoint(box[0]);
    var bottomRight = map.locationPoint(box[1]);
    // Build the model
    var roi = new ROI({ imageId : imageId, 
                        tag     : 'default', 
                        x       : topLeft.x,
                        y       : topLeft.y,
                        width   : bottomRight.x - topLeft.x,
                        height  : bottomRight.y - topLeft.y });
    boxes[id] = roi;
    roi.save({}, { 
        success: function(roi) {
            console.log("Saved "+roi.get("id"));   
        }
    }); 
}

function onBoxUpdate(id, box) {
    // Find this box
    console.log("Updated box: "+box);
    var roi = boxes[id];
    // Get pixel coordinates
    var topLeft     = map.locationPoint(box[0]);
    var bottomRight = map.locationPoint(box[1]);
    // Set the model
    roi.set({x       : topLeft.x,
             y       : topLeft.y,
             width   : bottomRight.x - topLeft.x,
             height  : bottomRight.y - topLeft.y });
    console.log(roi.attributes.x);
    roi.save({}, { 
        success: function(roi) {
            console.log("Updated "+roi.get("id"));   
        }
    });
}

// Creates a new box selector to track a box and its various modifications
function createBoxSelector() {
    boxselector = new wax.mm.boxselector();
    boxselector.map(map);
    boxselector.add();
    boxselector.addCallback('change', onBoxChange);
    boxselector.enable();
}

function loadRois() {
    // First load callback
    if(loadedRois) {
        loadedRois.map(renderROI);
    }
    map.removeCallback('drawn', loadRois);
}

// Sets up the map given tile json describing it, and attaches it to the dom
function initViewer(tilejson) {
    // Setup the map
    var layer = new wax.mm.connector(tilejson);
    layer.provider.tileLimits = [ new MM.Coordinate(0,0,3), new MM.Coordinate(3,5,3) ];
    map = new MM.Map('image-map');
    map.addCallback('drawn', loadRois);
    map.addLayer(layer);
    map.coordLimits = [ new MM.Coordinate(0,0,3), new MM.Coordinate(3,5,3) ];
    map.coordinate = new MM.Coordinate(0,0,3);
    map.requestRedraw();
}
