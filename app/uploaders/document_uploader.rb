class DocumentUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick
  include Cloudinary::CarrierWave

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
  def cache_dir
     "uploads_tmp/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_whitelist
    %w(pdf doc docx jpg jpeg gif png)
  end


  # def default_url
  #   ActionController::Base.helpers.asset_path('fallbacks/cake.png')
  # end

end
