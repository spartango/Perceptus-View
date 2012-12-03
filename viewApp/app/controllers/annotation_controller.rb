class AnnotationController < ApplicationController
  def segment
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve/' + params[:id] + '/0/{x}/{y}'] }
    @tilejson = tile.to_json
    render :layout => false
  end

#  def classify
#    @annotation = Annotation.new(params[:annotation])
#
#    respond_to do |format|
#      if @annotation.save
#        format.html { redirect_to @annotation, :notice => 'Annotation was successfully created.' }
#        format.json { render :json => @annotation, :status => :created, :location => @annotation }
#      else
#        format.html { render :action => "new" }
#        format.json { render :json => @annotation.errors, :status => :unprocessable_entity }
#      end
#    end
#  end

end 
