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
        respond_to do |format|
            result = ImageServer.post('/roi', :query => params)
            render :json => result
        end
    end

    # Handle ROI get requests 
    def show
        # proxy to GET /roi/id
        respond_to do |format|
            ImageServer.get('/roi/'+params[id]);
            render :json => result
        end
    end

    def update
        # proxy to PUT /roi/id
        respond_to do |format|
            ImageServer.put('/roi', :query => params)
            render :json => result
        end
    end

    def delete
        # Black hole, can't delete stuff
        respond_to do |format|
            render :nothing => true            
        end
    end

end
