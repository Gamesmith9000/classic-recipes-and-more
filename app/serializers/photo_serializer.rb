class PhotoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :file, :notes
end
