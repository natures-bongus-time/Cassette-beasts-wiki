function makeEditable() {
    const editableElement = document.getElementById('editableText');

    editableElement.contentEditable = 'true';

    editableElement.style.border = '2px dashed #ccc';
}
const bioElement = document.getElementById('userBio');
const savedBio = localStorage.getItem('userBio');
if (savedBio) {
    bioElement.innerText = savedBio;
}
bioElement.contentEditable = 'true';

bioElement.addEventListener('blur', () => {
    const newBio = bioElement.innerText;
    localStorage.setItem('userBio', newBio);
    console.log('Bio saved:', newBio);
});
const liveEditElement = document.getElementById('liveEdit');
    liveEditElement.contentEditable = 'true';

    liveEditElement.addEventListener('input', (e) => {
    console.log('Current content:', e.target.innerText);
});

liveEditElement.addEventListener('blur', (e) => {
    alert(`Saved: ${e.target.innerText}`)
});