class PhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :caption, :file, :url
end
