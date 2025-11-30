const SHEET_URLS = {
    projects: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5wIgRFvT-Iqzu7F46XiLxafouDiUVPNn75SKUi_WZ17HUN-f66KThMmHtRMp-SKe4qbrsS4qatUVb/pub?gid=0&single=true&output=csv',
    writing: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5wIgRFvT-Iqzu7F46XiLxafouDiUVPNn75SKUi_WZ17HUN-f66KThMmHtRMp-SKe4qbrsS4qatUVb/pub?gid=471361264&single=true&output=csv',
    records: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5wIgRFvT-Iqzu7F46XiLxafouDiUVPNn75SKUi_WZ17HUN-f66KThMmHtRMp-SKe4qbrsS4qatUVb/pub?gid=2066185915&single=true&output=csv'
};

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchWriting();
    fetchRecords();
});

function fetchProjects() {
    Papa.parse(SHEET_URLS.projects, {
        download: true,
        header: true,
        complete: function (results) {
            renderProjects(results.data);
        },
        error: function (err) {
            console.error('Error fetching projects:', err);
        }
    });
}

function renderProjects(data) {
    const container = document.getElementById('project-list');
    container.innerHTML = '';

    // Show all projects (or a reasonable limit like 20)
    const items = data;

    items.forEach(item => {
        if (!item.Name) return; // Skip empty rows

        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <div class="project-name"><a href="${item.Link || '#'}" target="_blank">${item.Name}</a></div>
            <div class="project-category">${item.Category || ''}</div>
            <div class="project-desc">${item.Desc || ''}</div>
            <div class="project-link"><a href="${item.Link || '#'}" target="_blank">Link</a></div>
        `;
        container.appendChild(div);
    });

    // Remove pagination UI
    const pag = document.getElementById('pagination');
    if (pag) pag.style.display = 'none';
}

function fetchWriting() {
    Papa.parse(SHEET_URLS.writing, {
        download: true,
        header: true,
        complete: function (results) {
            renderWriting(results.data);
        }
    });
}

function renderWriting(data) {
    const nonFunContainer = document.getElementById('write-non-fun');
    const dailyContainer = document.getElementById('write-daily');

    nonFunContainer.innerHTML = '';
    dailyContainer.innerHTML = '';

    data.forEach(item => {
        // Handle typo in header 'TItle' vs 'Title'
        const title = item.Title || item.TItle;
        if (!title) return;

        const div = document.createElement('div');
        div.className = 'write-item';
        div.innerHTML = `
            <a href="${item.Link || '#'}" class="write-title" target="_blank">${title}</a>
        `;

        if (item.Section && item.Section.toLowerCase().includes('non-fun')) {
            nonFunContainer.appendChild(div);
        } else if (item.Section && item.Section.toLowerCase().includes('daily')) {
            dailyContainer.appendChild(div);
        }
    });

    // Add "See all" links
    const nonFunLink = document.createElement('div');
    nonFunLink.className = 'write-item';
    nonFunLink.innerHTML = `<a href="https://ajamil.substack.com/" class="write-link see-all" target="_blank">See all &rarr;</a>`;
    nonFunContainer.appendChild(nonFunLink);

    const dailyLink = document.createElement('div');
    dailyLink.className = 'write-item';
    dailyLink.innerHTML = `<a href="https://medium.com/@AMJamil" class="write-link see-all" target="_blank">See all &rarr;</a>`;
    dailyContainer.appendChild(dailyLink);
}

function fetchRecords() {
    Papa.parse(SHEET_URLS.records, {
        download: true,
        header: true,
        complete: function (results) {
            renderRecords(results.data);
        }
    });
}

function renderRecords(data) {
    const container = document.getElementById('records-list');
    container.innerHTML = '';

    data.forEach(item => {
        if (!item.name) return;

        const div = document.createElement('div');
        div.className = 'record-row';
        div.innerHTML = `
            <div class="record-name">${item.name}</div>
            <div class="record-value">${item.record}</div>
        `;
        container.appendChild(div);
    });
}
