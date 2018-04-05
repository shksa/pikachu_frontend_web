const uploadImage = (imageFile) => {
  const formData = new FormData();
  formData.append('userName', 'guest');
  formData.append('userImage', imageFile);
  fetch('/uploadImage', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.text())
    .then(text => console.log(text))
    .catch(error => console.log(error))
};

module.exports = { uploadImage };

