class UsersController < ApplicationController
  def index
    @users = current_user.childrens.paginate(page: params[:page], per_page: 10)
  end

  def new
    @user = current_user.childrens.new
  end

  def edit
    @user = current_user.childrens.find(params[:id])
  end

  def update
    @user = current_user.childrens.find(params[:id])
    @user.assign_attributes(user_params)
    if @user.save!
      redirect_to users_path, notice: 'Utilisateur édité.'
    end
  end

  def destroy
    @user = current_user.childrens.find(params[:id])
    if @user.destroy!
      redirect_to users_path, notice: 'Utilisateur supprimé.'
    end
  end

  def create
    @user = current_user.childrens.new(user_params)
    @user.company = current_user.company
    if @user.save!
      redirect_to users_path, notice: 'Utilisateurs crées.'
    end
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :user_role_id, :password)
    end
end
