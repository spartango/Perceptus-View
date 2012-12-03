var boxselectors = {};
var test = { "blah":1, "yes":22 };
var map;

function getBoxes(boxes) {
    var ret = {};
    for (var i = 0; i < boxes.length; i++) {
      ret[i] = boxes[i].extent().lat;
    }
    return ret;
}

// Sets up the map given tile json describing it, and attaches it to the dom
function initViewer(tilejson) {
    // Setup the map
    var layer = new wax.mm.connector(tilejson);
    layer.provider.tileLimits = [ new MM.Coordinate(0,0,3), new MM.Coordinate(3,7,3) ];
    map = new MM.Map('image-map');
    map.addLayer(layer);
    map.coordLimits = [ new MM.Coordinate(0,0,3), new MM.Coordinate(3,7,3) ];
    map.setZoom(3);
}
// Creates and renders ROI box for classification
function createROI(roi_json) {
    var id = roi_json.id;
    boxselectors[id] = new wax.mm.boxselector();
    boxselectors[id].map(map);
    boxselectors[id].add();
    boxselectors[id].disable();
    boxselectors[id].extent(
      [new MM.Location(roi_json.x, roi_json.y),
       new MM.Location(roi_json.x + roi_json.width, roi_json.y + roi_json.height)]);
};
