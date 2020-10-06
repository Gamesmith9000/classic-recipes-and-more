class PhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :file, :title
end
