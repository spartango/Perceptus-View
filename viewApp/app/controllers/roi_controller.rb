require 'rubygems'
require 'httparty'

# HTTParty proxy mapper
class ImageServer
    include HTTParty
    base_uri 'localhost:8089'
    format :json
end

class RoiController < ApplicationController

    # Handle ROI creation requests
    def create
        # proxy to POST /roi
        result = ImageServer.post('/roi', 
            :body => params[:roi].to_json,
            :headers => { 'Content-Type' => 'application/json' })
        render :json => result
    end

    # Handle ROI get requests 
    def show
        # proxy to GET /roi/id
        ImageServer.get('/roi/'+params[id]);
        render :json => result
    end

    def update
        # proxy to PUT /roi/id
        ImageServer.put('/roi/'+params[id],             
            :body => params[:roi].to_json,
            :headers => { 'Content-Type' => 'application/json' })
        render :json => result
    end

    def delete
        # Black hole, can't delete stuff
        render :nothing => true            
    end

end
