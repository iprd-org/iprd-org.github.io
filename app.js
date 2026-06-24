let stations = [];

const results = document.getElementById("results");
const searchBox = document.getElementById("search");
const countrySelect = document.getElementById("country");
const categorySelect = document.getElementById("category");

async function load() {

    stations = await fetch("https://raw.githubusercontent.com/iprd-org/iprd/refs/heads/main/docs/site_data/metadata/catalog.json")
        .then(r => r.json());

    populateFilters();

    render();
}

function populateFilters() {

    const countries = [...new Set(
        stations.map(x => x.country).filter(Boolean)
    )].sort();

    countries.forEach(country => {

        const option = document.createElement("option");

        option.value = country;
        option.textContent = country;

        countrySelect.appendChild(option);
    });

    const categories = new Set();

    stations.forEach(station => {

        if (!station.categories)
            return;

        station.categories
            .split(";")
            .forEach(x => categories.add(x.trim()));
    });

    [...categories]
        .sort()
        .forEach(category => {

            const option = document.createElement("option");

            option.value = category;
            option.textContent = category;

            categorySelect.appendChild(option);
        });
}

function render() {

    const q =
        searchBox.value
            .toLowerCase()
            .trim();

    const country =
        countrySelect.value;

    const category =
        categorySelect.value;

    const filtered = stations.filter(station => {

        if (
            q &&
            !station.name.toLowerCase().includes(q)
        )
            return false;

        if (
            country &&
            station.country !== country
        )
            return false;

        if (
            category &&
            !(station.categories || "")
                .includes(category)
        )
            return false;

        return true;
    });

    results.innerHTML =
        filtered.map(station => `
            <div class="card">

                <h3>${station.name}</h3>

                <div class="meta">
                    ${station.country}
                </div>

                <div class="meta">
                    ${station.categories || ""}
                </div>

                ${
                    station.website
                    ? `<a href="${station.website}" target="_blank">
                        Website
                       </a>`
                    : ""
                }

            </div>
        `)
        .join("");
}

searchBox.addEventListener("input", render);
countrySelect.addEventListener("change", render);
categorySelect.addEventListener("change", render);

load();
