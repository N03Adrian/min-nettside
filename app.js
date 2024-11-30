document.addEventListener("DOMContentLoaded", function () {
    const materialForm = document.getElementById('materialForm');
    const withdrawForm = document.getElementById('withdrawForm');
    const materialSelect = document.getElementById('materialSelect');
    const inventoryList = document.getElementById('inventoryList');

    // Hent lagrede materialer fra localStorage
    let materials = JSON.parse(localStorage.getItem('materials')) || [];

    // Vis materialer i lagerlisten
    function displayInventory() {
        inventoryList.innerHTML = '';
        materials.forEach((material, index) => {
            const li = document.createElement('li');
            li.textContent = `${material.name}: ${material.quantity} stk`;
            inventoryList.appendChild(li);
        });

        // Oppdater select-elementet for uttak
        materialSelect.innerHTML = '';
        materials.forEach((material, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = material.name;
            materialSelect.appendChild(option);
        });
    }

    // Legg til nytt materiale
    materialForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const materialName = document.getElementById('materialName').value;
        const quantity = parseInt(document.getElementById('quantity').value);

        const existingMaterial = materials.find(material => material.name === materialName);

        if (existingMaterial) {
            existingMaterial.quantity += quantity;  // Øk eksisterende beholdning
        } else {
            materials.push({ name: materialName, quantity: quantity });
        }

        // Lagre i localStorage
        localStorage.setItem('materials', JSON.stringify(materials));

        // Tøm skjemaet og vis oppdatert lagerstatus
        materialForm.reset();
        displayInventory();
    });

    // Uttak av materiale
    withdrawForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedMaterialIndex = materialSelect.value;
        const withdrawQuantity = parseInt(document.getElementById('withdrawQuantity').value);

        if (selectedMaterialIndex !== '' && withdrawQuantity > 0) {
            const material = materials[selectedMaterialIndex];
            if (material.quantity >= withdrawQuantity) {
                material.quantity -= withdrawQuantity;
                localStorage.setItem('materials', JSON.stringify(materials));
                displayInventory();
            } else {
                alert("Ikke nok materiale på lager.");
            }
        }
    });

    // Vis lagerbeholdning ved første last
    displayInventory();
});
