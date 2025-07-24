import React, { useEffect, useState } from 'react';
import {
  useCreateRolesMutation,
  useGetRolesQuery,
} from '@/store/api';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { key: 'product_name', label: 'Product Name' },
  { key: 'risk_level', label: 'Risk Level' },
  { key: 'knowledge_min', label: 'Knowledge Minimum' },
  { key: 'biases', label: 'Biases' },
  { key: 'reason', label: 'Reason' },
];

function RoleManagement() {
  const [roleName, setRoleName] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [createRole, { isLoading, isError, error:mutateError }] = useCreateRolesMutation();
  const { data: roles = [], refetch ,error:getError} = useGetRolesQuery({});
  const navigate = useNavigate()

  useEffect(() => {
      if (getError || mutateError) {
          console.error("API Error:", getError , mutateError);
          navigate('/login');
      }
  }, [getError, mutateError, navigate]);
  
  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    const res = await createRole({
      role_name: roleName.trim(),
      features: selectedFeatures,
    });

    if ('data' in res) {
      setRoleName('');
      setSelectedFeatures([]);
      refetch(); // refresh role list
    }
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 32,
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 32,
          color: '#1e293b',
        }}
      >
        Role Creation & Feature Assignment
      </h1>

      <div
        style={{
          display: 'flex',
          gap: 32,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Create Role Card */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 12px #0001',
            padding: 28,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18, color: '#2563eb' }}>
            Create a New Role
          </h2>

          <form onSubmit={handleAddRole}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, color: '#334155' }}>
                Role Name
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Relationship Manager"
                  required
                  style={{
                    display: 'block',
                    marginTop: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    width: '100%',
                    fontSize: 16,
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 500, color: '#334155', marginBottom: 8 }}>
                Assign Features
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {FEATURES.map((feature) => (
                  <label
                    key={feature.key}
                    style={{
                      background: selectedFeatures.includes(feature.key) ? '#dbeafe' : '#f1f5f9',
                      border: selectedFeatures.includes(feature.key)
                        ? '2px solid #2563eb'
                        : '2px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      color: '#1e293b',
                      transition: 'all 0.2s',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.key)}
                      onChange={() => handleFeatureChange(feature.key)}
                      style={{ marginRight: 8 }}
                    />
                    {feature.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? '#94a3b8' : '#2563eb',
                color: '#fff',
                padding: '10px 28px',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 4px #0001',
                marginTop: 8,
              }}
            >
              {isLoading ? 'Creating...' : 'Add Role'}
            </button>

            {isError && (
              <div style={{ color: 'red', marginTop: 12 }}>
                Error: {(isError as any)?.data?.message || 'Something went wrong.'}
              </div>
            )}
          </form>
        </div>

        {/* Existing Roles Display */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18, color: '#2563eb' }}>
            Existing Roles
          </h2>

          {roles.length === 0 ? (
            <div
              style={{
                color: '#64748b',
                fontStyle: 'italic',
                padding: 24,
                background: '#f1f5f9',
                borderRadius: 12,
              }}
            >
              No roles created yet. Add a role to get started.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {roles.roles?.map((role: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 1px 6px #0001',
                    padding: 18,
                    borderLeft: '5px solid #2563eb',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      color: '#1e293b',
                      marginBottom: 6,
                    }}
                  >
                    {role.role_name}
                  </div>
                  <div style={{ color: '#334155', fontSize: 15 }}>
                    Features:{' '}
                    {role.features?.length === 0 ? (
                      <span style={{ color: '#f59e42', fontStyle: 'italic' }}>
                        No features assigned
                      </span>
                    ) : (
                      role.features
                        .map(
                          (f: string) =>
                            FEATURES.find((ft) => ft.key === f)?.label || f
                        )
                        .join(', ')
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleManagement;
