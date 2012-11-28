/**
 * Annotation view 
 * 
 * Draws ROIs on to an image
 * Adjusts ROIs position as the canvas moves
 * Must be attached to a MM Map to use
 */
AnnotationView = Backbone.View.extend({
    render: function() {
        // We'll start attached to the map tag
        // Create an element under map's parent to hang boxes 
        this.annotationLayer = document.createElement('div');
        this.annotationLayer.className = 'annotation-layer';
        this.annotationLayer.id = this.el.id + '-AnnotationView';
        this.el.appendChild(this.annotationLayer);

        // Draw our ROIViews
        this.roiViews = [];
        this.model.get('ROIs').each(
            function(model, index, collection) {
                // Build an ROIView
                var roiView = new ROIView({
                    el : document.createElement('div'), 
                    model: model
                });
            }
        );
    }
});

ROIView = Backbone.View.extend({
    
});