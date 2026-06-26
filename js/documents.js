// RENDERIZAR TABLA DE DOCUMENTOS
window.renderDocumentList = function() {
  const tbody = document.getElementById('docTable');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const stateFilter = document.getElementById('filter-state').value;
  const typeFilter = document.getElementById('filter-type').value;
  const normaFilter = document.getElementById('filter-norma').value;
  const globalSearch = document.getElementById('global-search-input').value.toLowerCase().trim();

  // Filtrado según Rol (Lector solo ve aprobados)
  let docList = window.state.documents;
  if (window.state.activeRole === 'Lector') {
    docList = docList.filter(d => d.estado === 'Aprobado');
  }

  // Filtrado de Combos
  docList = docList.filter(d => {
    const matchState = (stateFilter === 'all') || 
                       (stateFilter === 'Borrador' && d.estado === 'Borrador') ||
                       (stateFilter === 'En Revisión' && d.estado === 'En Revisión') ||
                       (stateFilter === 'En Aprobación' && d.estado === 'En Aprobación') ||
                       (stateFilter === 'Aprobado' && d.estado === 'Aprobado') ||
                       (stateFilter === 'Rechazado' && d.estado === 'Rechazado') ||
                       (stateFilter === 'Vencido' && d.vencido);

    const matchType = (typeFilter === 'all') || (d.type === typeFilter);
    const matchNorma = (normaFilter === 'all') || (d.norma === normaFilter);
    
    // Búsqueda por texto (código o título) (G08 Scenario 1)
    const matchSearch = !globalSearch || 
                         d.title.toLowerCase().includes(globalSearch) || 
                         d.code.toLowerCase().includes(globalSearch);

    return matchState && matchType && matchNorma && matchSearch;
  });

  if (docList.length === 0) {
    document.getElementById('no-docs-message').style.display = 'flex';
  } else {
    document.getElementById('no-docs-message').style.display = 'none';
  }

  docList.forEach(d => {
    const tr = document.createElement('tr');
    tr.onclick = () => {
      if (typeof loadDocumentToEditor === 'function') loadDocumentToEditor(d.code);
      window.goPage('edit');
      showToast(`Documento ${d.code} cargado en el editor.`, 'ok');
    };

    let badgeClass = 's-borrador';
    let estadoLabel = d.estado;
    if (d.vencido) {
      badgeClass = 's-vencido';
      estadoLabel = 'Vencido';
    } else if (d.estado === 'Borrador') badgeClass = 's-borrador';
    else if (d.estado === 'En Revisión') badgeClass = 's-revision';
    else if (d.estado === 'En Aprobación') badgeClass = 's-aprobacion';
    else if (d.estado === 'Aprobado') badgeClass = 's-vigente';
    else if (d.estado === 'Rechazado') badgeClass = 's-rechazado';

    tr.innerHTML = `
      <td><strong>${d.code}</strong></td>
      <td>${d.title} ${d.critico ? '<span class="badge" style="background:#FDEDEC;color:var(--red)">Critico</span>' : ''}</td>
      <td>${d.type}</td>
      <td>${d.norma}</td>
      <td><span class="status-badge ${badgeClass}">${estadoLabel}</span></td>
      <td>${d.version}</td>
    `;
    tbody.appendChild(tr);
  });

  // Actualizar contador del sidebar
  const badgeEl = document.getElementById('sb-docs-badge');
  if (badgeEl) badgeEl.textContent = docList.length;
};

// FILTRADO DESDE LA ALERTA DE VENCIDOS DEL DASHBOARD
window.filterDocsByVencidos = function() {
  document.getElementById('filter-state').value = 'Vencido';
  document.getElementById('filter-type').value = 'all';
  document.getElementById('filter-norma').value = 'all';
  window.goPage('docs');
  window.applyFilters();
};

window.applyFilters = function() {
  window.renderDocumentList();
};

window.clearFilters = function() {
  document.getElementById('filter-state').value = 'all';
  document.getElementById('filter-type').value = 'all';
  document.getElementById('filter-norma').value = 'all';
  document.getElementById('global-search-input').value = '';
  window.renderDocumentList();
};

window.handleGlobalSearch = function(event) {
  window.renderDocumentList();
};
