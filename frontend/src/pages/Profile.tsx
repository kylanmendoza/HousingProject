// src/pages/Profile.tsx
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Building, Shield, CheckCircle, XCircle } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-blue-100 mt-1">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* Account Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">Account Status</span>
                <div className="flex items-center space-x-2">
                  {user.verified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-400 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-red-700 dark:text-red-400 font-medium">Not Verified</span>
                    </>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee ID</p>
                      <p className="text-gray-900 dark:text-gray-100">{user.employeeId}</p>
                    </div>
                  </div>

                  {user.department && (
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                        <p className="text-gray-900 dark:text-gray-100">{user.department}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Role</p>
                      <p className="text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Permissions */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Permissions</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Browse and search properties</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Save favorite properties</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Contact landlords directly</span>
                  </div>

                  {(user.role === 'provider' ||
                    user.role === 'admin' ||
                    user.role === 'superadmin') && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Submit property listings</span>
                    </div>
                  )}

                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          Review and approve properties
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Manage user accounts</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!user.verified && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Action Required:</strong> Please check your email to verify your
                    account. Some features may be limited until verification is complete.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
