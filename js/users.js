// USUARIOS Y ROLES (KANBAN BOARD CON DRAG AND DROP) (G07 Scenarios 1, 3)
window.renderKanban = function() {
  const container = document.getElementById('kanban-board-container');
  if (!container) return;
  container.innerHTML = '';

  const columns = ['Administrador', 'Elaborador', 'Revisor', 'Aprobador', 'Lector'];

  columns.forEach(role => {
    const col = document.createElement('div');
    col.className = 'kanban-column';
    col.dataset.role = role;
    col.ondragover = window.allowDrop;
    col.ondragleave = window.dragLeave;
    col.ondrop = window.dropCard;

    let roleDesc = '';
    if (role === 'Administrador') roleDesc = 'Acceso total y control global';
    else if (role === 'Elaborador') roleDesc = 'Creación de borradores';
    else if (role === 'Revisor') roleDesc = 'Comentarios técnicos';
    else if (role === 'Aprobador') roleDesc = 'Firma y doble validación';
    else if (role === 'Lector') roleDesc = 'Consulta de aprobados';

    col.innerHTML = `
      <div class="kanban-column-header">
        <span><i class="ti ti-${role === 'Administrador' ? 'crown' : (role === 'Elaborador' ? 'pencil' : (role === 'Revisor' ? 'search' : (role === 'Aprobador' ? 'shield-check' : 'eye')))}"></i> ${role}</span>
        <small>${roleDesc}</small>
      </div>
      <div class="kanban-column-body"></div>
      <button class="btn sm" onclick="window.openNewUserModal('${role}')" class="action-restrict-hide">+ Agregar</button>
    `;

    const body = col.querySelector('.kanban-column-body');
    const usersInRole = window.state.users.filter(u => u.role === role);

    usersInRole.forEach(u => {
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.setAttribute('draggable', 'true');
      card.setAttribute('ondragstart', 'window.dragCard(event)');
      card.dataset.user = u.name;
      card.innerHTML = `
        <strong>${u.name}</strong>
        <div class="small">${u.role}</div>
      `;
      body.appendChild(card);
    });

    container.appendChild(col);
  });
};

let kanbanDragCard = null;
window.dragCard = function(event) {
  kanbanDragCard = event.currentTarget;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', event.currentTarget.dataset.user);
};

window.allowDrop = function(event) {
  event.preventDefault();
  const body = event.currentTarget.querySelector('.kanban-column-body');
  if (body) body.classList.add('drag-over');
};

window.dragLeave = function(event) {
  const body = event.currentTarget.querySelector('.kanban-column-body');
  if (body) body.classList.remove('drag-over');
};

window.dropCard = function(event) {
  event.preventDefault();
  const column = event.currentTarget;
  const body = column.querySelector('.kanban-column-body');
  if (!body || !kanbanDragCard) return;

  body.classList.remove('drag-over');
  body.appendChild(kanbanDragCard);

  const targetRole = column.dataset.role;
  const username = kanbanDragCard.dataset.user;

  // Actualizar rol del usuario en la base de datos (G07 Scenario 3)
  const user = window.state.users.find(u => u.name === username);
  if (user) {
    user.role = targetRole;
    showToast(`Usuario ${username} movido a ${targetRole}`, 'ok');
    logAuditAction(`Cambió el rol del usuario ${username} a ${targetRole} vía Kanban`);
    
    // Si modificamos el rol del usuario activo actual, aplicamos los permisos
    if (username === window.state.activeUser) {
      window.state.activeRole = targetRole;
      document.getElementById('uRole').textContent = '· ' + targetRole;
      if (typeof applyRoleRestrictiveness === 'function') applyRoleRestrictiveness();
      if (typeof rebuildDashboard === 'function') rebuildDashboard();
      if (typeof renderDocumentList === 'function') renderDocumentList();
    }
  }

  kanbanDragCard = null;
  window.renderKanban();
};

window.openNewUserModal = function(role = '') {
  openModal('newUserModal');
  const roleSelect = document.getElementById('newUserRole');
  if (roleSelect && role) roleSelect.value = role;
};

window.saveNewUser = function() {
  const name = document.getElementById('newUserName').value.trim();
  const email = document.getElementById('newUserEmail').value.trim();
  const role = document.getElementById('newUserRole').value;
  const status = document.getElementById('newUserStatus').value;
  const notes = document.getElementById('newUserNotes').value.trim();

  if (!name || !email) {
    showToast('Por favor, ingresa el nombre y correo del usuario.', 'err');
    return;
  }

  const words = name.split(' ');
  const short = words.map(w => w[0]).join('').toUpperCase().slice(0, 3);

  const newUser = {
    name: name,
    short: short,
    role: role,
    status: status,
    notes: notes
  };

  window.state.users.push(newUser);
  closeModal();
  showToast(`Usuario ${name} registrado con rol ${role}.`, 'ok');
  logAuditAction(`Registró nuevo usuario: ${name} (${role})`);

  window.renderKanban();
  if (typeof rebuildDashboard === 'function') rebuildDashboard();
};
