class AnnotationController < ApplicationController
 
  def segment
    session[:seen_image_ids] = session[:seen_image_ids] ? session[:seen_image_ids] + [ params[:id] ] : [ params[:id] ]
    imageIds = ["test", "rest", "blah", "doh"]
    @nextId = false
    if (session[:session_id] == session[:last_session_id])
      idsLeft = imageIds - session[:seen_image_ids]
      if (!idsLeft.empty?)
        @nextId = idsLeft[0]
      end
    else
      @nextId = imageIds[0]
    end
    session[:last_session_id] = session[:session_id]
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve/' + params[:id] + '/0/{x}/{y}'] }
    @tilejson = tile.to_json
    render :layout => false
  end

  def classify
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve/' + params[:id] + '/0/{x}/{y}'] }
    @tilejson = tile.to_json
    render :layout => false
  end

end 
