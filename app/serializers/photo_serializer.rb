class PhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :file, :tag, :title
end
