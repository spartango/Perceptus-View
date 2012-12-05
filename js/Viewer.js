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

    // Keep track of the roi with backbone
    var bbroi = new ROI(roi);
    boxes[roiBox.getId()] = bbroi;

    // Attach a classification label to the boxselector
    if(tagOptions) {
        addTagger(roiBox);
    }
}

// ------------------------------------------------------------------------
// Session 

function showInstruction() {
    if (!firstLabel && numImagesSeen == 1) {
      $('.instructions-dynamic').text("Now drag a box over the blob you identified!");
    }
}

function showFeedback() {
    if (!firstLabel && numImagesSeen == 1) {
      $('.instructions-dynamic').text("Great! Pan around the image and see if you can find another. Then click \"Draw\" and box it too!");
      firstLabel = true;
    } else if (numImagesSeen == 1) {
     $('.instructions-dynamic').text("Awesome, keep going! Resize any of your boxes if you need to, and click \"Submit\" when you're done.");
    }
}

// ------------------------------------------------------------------------
// ROI Tagging

// Add the selector to a boxselector
function addTagger(roiBox) {
    var boxElement = $('#' + map.parent.id + '-boxselector-box' + roiBox.getId());
    
    // Create a selector 
    var selectElement = $(document.createElement('select'));
    // Add the instructive label
    selectElement.append('<option value="" disabled="" selected="" style="display:none;">Label</option>')
    // Add each of the options
    tagOptions.map(function(tag) {
        selectElement.append('<option value='+tag+'>'+tag+'</option>');
    });

    // Setup event handling
    // Need to prevent scrolling on mouse events
    selectElement.mousedown(function() {
       map.disableScrolling(); 
    });

    selectElement.mouseup(function() {
       map.enableScrolling(); 
    });

    // Call the onBoxTag method with right args
    selectElement.change(function(e) {
        onBoxTag(roiBox.getId(), $(e.target).val())
    });

    // Append the selector as a child of the selector
    boxElement.append(selectElement);
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

    showInstruction();
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

    showFeedback();
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

    roi.save({}, { 
        success: function(roi) {
            console.log("Updated "+roi.get("id"));   
        }
    });
}

function onBoxTag(id, tag) {
    // Find this box
    var roi = boxes[id];

    // Copy roi with new tag to avoid overwriting
    var newRoi = new ROI({ imageId : roi.get('imageId'), 
                           tag     : tag,
                           x       : roi.get('x'),
                           y       : roi.get('y'),
                           width   : roi.get('width'),
                           height  : roi.get('height') });
    console.log("Tagged roi: "+newRoi);

    // Commit the change
    newRoi.save({}, { 
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
};
