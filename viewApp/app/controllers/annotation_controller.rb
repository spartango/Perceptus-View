class AnnotationController < ApplicationController
  def segment
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
