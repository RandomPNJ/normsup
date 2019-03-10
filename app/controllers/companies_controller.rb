class CompaniesController < ApplicationController

  def edit
    @company = current_user.company
  end

  private
    def company_params
      params.require(:company).permit()
    end
end
