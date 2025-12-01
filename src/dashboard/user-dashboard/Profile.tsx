import React, { useState } from "react";

export default function Profile() {
  const [editOpen, setEditOpen] = useState(false);

  // Fake user data
  const [user, setUser] = useState({
    name: "Carlos Hernández",
    email: "carlos.hdz@example.com",
    phone: "+53 5 123 4567",
    lockerId: "XG15STV",
    city: "La Habana",
    address: "Calle 23 #1203, Vedado",
    joined: "2024-09-10",
    avatar: "",
  });

  // Temporary values for edit modal
  const [temp, setTemp] = useState(user);

  function handleSave() {
    setUser(temp);
    setEditOpen(false);
    alert("Perfil actualizado (fake)");
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#166534] mb-1">Mi Perfil</h2>
        <p className="text-gray-600 mb-6">Información personal, casillero virtual y seguridad.</p>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#166534] text-white flex items-center justify-center text-2xl font-bold">
                {user.name.split(" ").map(s => s[0]).join("").slice(0,2)}
              </div>

              <h3 className="mt-3 text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.phone}</p>

              <button
                onClick={() => { setTemp(user); setEditOpen(true); }}
                className="mt-4 px-4 py-2 rounded-md text-white"
                style={{ background: "#166534" }}
              >
                Editar Perfil
              </button>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-gray-600">
              <p><b>Ciudad:</b> {user.city}</p>
              <p><b>Dirección:</b> {user.address}</p>
              <p><b>Miembro desde:</b> {user.joined}</p>
            </div>
          </div>

          {/* Locker Info */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3 text-[#166534]">Casillero Virtual (EXPRESUR)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

              <div className="bg-gray-50 p-4 rounded border">
                <p className="text-xs text-gray-500">Mi Identificador</p>
                <p className="text-xl font-bold text-[#166534]">{user.lockerId}</p>
                <p className="text-xs text-gray-500">Asignado automáticamente</p>
              </div>

              <div className="bg-gray-50 p-4 rounded border">
                <p className="text-xs text-gray-500">Ciudad de Origen</p>
                <p className="text-base font-semibold">Miami, Florida</p>
                <p className="text-xs text-gray-500">Centro logístico EXPRESUR</p>
              </div>

              <div className="bg-white border p-4 rounded">
                <p className="text-xs text-gray-500">Dirección de Casillero</p>
                <p className="font-medium mt-1">
                  EXPRESUR Warehouse<br />
                  12345 SW 172nd Ave<br />
                  Miami, FL 33032<br />
                  <b>EXPRESUR – {user.lockerId}</b><br />
                  Phone: 786-314-4045
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#166534]">Seguridad de Cuenta</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div>
                <b>Contraseña</b>
                <p className="text-gray-500 text-xs">Último cambio: 3 meses atrás</p>
              </div>
              <button className="px-3 py-2 border rounded-md">Cambiar</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div>
                <b>Autenticación de 2 Pasos</b>
                <p className="text-gray-500 text-xs">No habilitado</p>
              </div>
              <button className="px-3 py-2 border rounded-md">Activar</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div>
                <b>Sesiones activas</b>
                <p className="text-gray-500 text-xs">2 dispositivos</p>
              </div>
              <button className="px-3 py-2 border rounded-md">Cerrar Sesiones</button>
            </div>
          </div>
        </div>
      </div>

      {/* ----- Edit Modal ----- */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow">

            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Editar Perfil</h3>
              <button onClick={() => setEditOpen(false)} className="text-gray-600">✕</button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="text-gray-500">Nombre</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={temp.name}
                  onChange={(e) => setTemp({ ...temp, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-500">Email</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={temp.email}
                  onChange={(e) => setTemp({ ...temp, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-500">Teléfono</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={temp.phone}
                  onChange={(e) => setTemp({ ...temp, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-500">Ciudad</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={temp.city}
                  onChange={(e) => setTemp({ ...temp, city: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-500">Dirección</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={temp.address}
                  onChange={(e) => setTemp({ ...temp, address: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 border rounded-md">Cancelar</button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md text-white"
                style={{ background: "#166534" }}
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
