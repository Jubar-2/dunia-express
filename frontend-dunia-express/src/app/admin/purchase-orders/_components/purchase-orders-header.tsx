import { AdminPageHeader } from "@/components/common";
import { SquareDashedText } from "lucide-react";

interface IPurchaseOrdersHeaderProps {
    isDataAvailable: boolean
}

export default function PurchaseOrdersHeader({
    isDataAvailable
}: IPurchaseOrdersHeaderProps) {
    return (
        <AdminPageHeader
            title="Purchase orders"
            icon={SquareDashedText}
            primaryAction={isDataAvailable ? {
                label: "Create purchase order",
                href: "/admin/purchase-orders/new",
                icon: SquareDashedText,
            } : undefined}
        />
    )
}