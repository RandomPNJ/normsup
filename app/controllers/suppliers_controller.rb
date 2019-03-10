class SuppliersController < ApplicationController

  def index
    @suppliers = current_user.companies.paginate(page: params[:page], per_page: 10)
    respond_to do |format|
      format.html
      format.xlsx
      format.csv { send_data @suppliers.to_csv, filename: "suppliers-#{Date.today}.csv" }
    end
  end

  def edit
    @supplier = current_user.suppliers.find_by_id(params[:id])
  end

  def update
    @supplier = current_user.suppliers.find_by_id(params[:id])
    @supplier.attributes = edit_supplier_params
    if @supplier.save!
      redirect_to suppliers_path, notice: 'Fournisseur mis à jour'
    end
  end

  def destroy
    @supplier = current_user.suppliers.find_by_id(params[:id])
    redirect_back(fallback_location: root_path, notice: 'Nous avons supprimé le fournisseur de votre liste.') if @supplier.destroy!
  end

  def new
    @supplier = current_user.companies.new
  end

  def search
    req = HTTParty.get('https://data.opendatasoft.com/api/records/1.0/search/?apikey=4b911b0c9cf7eb3a766465b3d1269e65dd4f0d864cde377c1d54d8b0&dataset=sirene%40public&q=' + params[:q])
    response = JSON(req.body)
    @companies = []
    if false # company inside bdd

    else
      if response['records'].count > 0
        i = 0
        while i < response['records'].count
          row = response['records'][i]['fields']
          company = Company.find_by(siret: row["siret"]) || Company.new
          keepers = Company.attribute_names
          row.keep_if {|key,_| keepers.include? key }
          company.attributes = row.to_hash
          company.save!
          @companies.push(company)
          i += 1
        end
      end
    end
  end
  # Si un champ est manquant, me poper une notification slack et ajouter le champ à la volée. plus haut dans company.attributes, ne prendre que les keys de row.to_hash qui figurent dans Company.attribute_names

  # >>  Company.attribute_names
  # => ["id", "name", "siret", "invalid_at", "valid_at", "is_valid", "kbis", "urssaf", "lnte", "created_at", "updated_at", "rails", "g", "migration", "add_fields_to_company", "efetcent", "l6_declaree", "l6_normalisee", "libtefen", "iriset", "libcom", "typvoie", "dapet", "dcren", "l1_normalisee", "epci", "ddebact", "categorie", "tcd", "modet", "libtefet", "proden", "libtu", "siren", "nom_dept", "defet", "apet700", "depcomet", "section", "tu", "libvoie", "defen", "libapet", "depcomen", "amintret", "code_section", "l4_normalisee", "prodet", "libactivnat", "nomen_long", "codpos", "monoact", "code_classe", "l4_declaree", "amintren", "apen700", "siege", "nic", "tefet", "libreg_new", "nj", "libmonoact", "numvoie", "nicsiege", "libmodet", "libmoden", "lieuact", "diffcom", "dcret", "du", "coordonnees", "depet", "code_division", "code_groupe", "datemaj", "dapen", "l7_normalisee", "l1_declaree", "activnat", "uu", "activite", "libnj", "tefen", "efencent", "rpen", "origine", "libapen", "zemet", "arronet", "saisonat", "rpet", "sous_classe", "moden", "comet", "auxilt", "ind_publipo", "liborigine", "aprm", "ctonet", "l2_normalisee", "l3_normalisee", "l3_declaree", "enseigne", "l2_declaree", "sigle", "indrep", "l5_declaree", "tca", "esaapen", "esaann", "esasec1n", "libesaapen", "libtca"]

  def create
    @supplier = Supplier.new(create_supplier_params)
    @supplier.user = current_user
    if @supplier.company_id.blank? || @supplier.save!
      redirect_to edit_supplier_path(@supplier), notice: 'Fournisseur ajouté avec succès.'
    else
      redirect_back fallback_location: suppliers_path, alert: 'Une erreur s\'est produite lors de l\'ajout du fournisseur.'
      # Onesignal, notification d'erreur lors de l'ajout du fournisseur
    end
  end

  private
    def create_supplier_params
      params.require(:supplier).permit(:company_id)
    end

    def edit_supplier_params
      if params[:supplier].present?
        params.require(:supplier).permit(interlocutors_attributes: [:id, :first_name, :last_name, :email, :position, :man, :privileged, :_destroy])
      else
        {}
      end
    end

end
