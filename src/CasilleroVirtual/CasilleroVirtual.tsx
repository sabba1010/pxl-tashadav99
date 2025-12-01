import React from 'react';

interface LockerAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

const FAKE_DATA: LockerAddress = {
  name: 'Ivan Martinez',
  address1: '1940 NW 70th Ave',
  address2: 'WeShipYou CUDUGDUU',
  city: 'Miami',
  state: 'FL (Florida)',
  zip: '33126',
  phone: '(786) 651-0451',
};

const CasilleroVirtual: React.FC<{ data?: LockerAddress }> = ({ data = FAKE_DATA }) => {
  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">$</div>
          <h2 className="text-xl font-semibold">Your US Address</h2>
        </div>
        <div className="text-sm px-3 py-1 rounded-md border">$22.09 &nbsp; <span className="text-gray-500">{data.name}</span></div>
      </div>

      {/* Info box like the screenshot */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 font-bold">i</div>
          <div className="text-sm text-blue-900">
            <div className="font-semibold">United States Locker</div>
            <div>
              This is your designated locker address in the United States. When making a purchase, ensure that this address is listed in your shipping
              information. Upon receipt at our warehouse, we will process your items and arrange for their delivery straight to your home upon arrival.
            </div>
          </div>
        </div>
      </div>

      {/* Address card */}
      <div className="bg-white shadow-sm border rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="col-span-1">Name</div>
          <div className="col-span-2 font-mono text-gray-800">{data.name}</div>

          <div className="col-span-1">Address Line 1</div>
          <div className="col-span-2 font-mono text-gray-800">{data.address1}</div>

          <div className="col-span-1">Address Line 2</div>
          <div className="col-span-2 font-mono text-gray-800">{data.address2}</div>

          <div className="col-span-1">City</div>
          <div className="col-span-2 font-mono text-gray-800">{data.city}</div>

          <div className="col-span-1">State</div>
          <div className="col-span-2 font-mono text-gray-800">{data.state}</div>

          <div className="col-span-1">ZIP</div>
          <div className="col-span-2 font-mono text-gray-800">{data.zip}</div>

          <div className="col-span-1">Phone</div>
          <div className="col-span-2 font-mono text-gray-800">{data.phone ?? '-'}</div>
        </div>

        <p className="mt-6 text-xs text-gray-400">The indicated phone number is to be used uniquely when filling in the information during purchases in stores. If you want to contact us, please use our contact details.</p>
      </div>

      {/* Simple footer actions (fake) */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-4 py-2 border rounded-md text-sm">Edit</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Use this address</button>
      </div>
    </div>
  );
};

export default CasilleroVirtual;
