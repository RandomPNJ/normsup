class StatsController < ApplicationController
  def index
    @suppliers = current_user.companies
  end
end
