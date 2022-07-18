import { PermissionDenied } from "@modules/auth/components/PermissionDenied"
import { Loader } from "@saas-ui/react"
import { PermissionRequirement } from "../auth/permissions"
import { usePermission } from "../hooks/use-permission"

type RestrictedProps = {
    to?: PermissionRequirement
    fallback?: JSX.Element | string | null
    loadingComponent?: JSX.Element | string
}

export const Restricted: React.FC<RestrictedProps> = ({
    to,
    fallback = to ? <PermissionDenied permission={to} /> : null,
    loadingComponent = <Loader />,
    children,
}) => {
    if (!to) {
        return <>{children}</>
    }
    const [loading, allowed] = usePermission({ requirement: to})
    if (loading) {
        return <>{loadingComponent}</>
    }
    if (allowed) {
        return <>{children}</>
    }
    return <>{fallback}</>
}