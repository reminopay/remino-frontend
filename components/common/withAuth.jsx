import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useApiRequest from "@/hooks/useApiRequest";
import { useGlobalActions } from "@/app/[locale]/GlobalActionsContext";
import { checkUserSession } from "@/utils/checkSession";
import { constructUrl } from "@/axiosConfig";

const withAuth = (WrappedComponent, options = {}) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { makeRequest } = useApiRequest();
    const { showVerificationBottomSheet } = useGlobalActions();

    const getProfile = async () => {
      return new Promise((resolve, reject) => {
        makeRequest(
          {
            method: "GET",
            url: constructUrl("profile/", "v2"),
          },
          (responseData) => {
            resolve(responseData[0].permissions);
          },
          (error) => {
            reject(error);
          },
          (error) => {
            reject(error);
          },
        );
      });
    };

    useEffect(() => {
      const checkAuth = async () => {
        /**
         * check if user is authenticated, if authenticated navigate to home, if not navigate to onboarding page.
         * if user is authenticated but not verified in any of the countries gets redirected to account-verification page
         * It does not take any parameters.
         * @return {React.ElementType} the component or page that is using this HOC
         */
        const isAuthenticated = await checkUserSession();

        if (!isAuthenticated) {
          if (localStorage.getItem("auth_status")) router.push("/auth/login");
          else router.push("/onboarding");
        } else {
          const requiredActions = options.requiredActions;

          if (requiredActions) {
            await getProfile().then((permissions) => {
              const hasRequiredActions = requiredActions.every((action) => {
                return permissions.some((userAction) =>
                  userAction.includes(action),
                );
              });

              if (!hasRequiredActions) {
                router.push("/home");
                showVerificationBottomSheet();
              } else {
                setLoading(false);
              }
            });
          } else {
            setLoading(false);
            return;
          }
        }
      };

      checkAuth();
    }, [router, options.requiredActions]);

    if (loading) {
      // Render loading state or spinner if needed
      return null;
    }

    // Render the wrapped component if authenticated and has required actions
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
