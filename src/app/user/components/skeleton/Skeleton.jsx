import "./Skeleton.css";

// Base skeleton component với animation shimmer
export function Skeleton({ width, height, borderRadius = 4, className = "" }) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width || "100%",
                height: height || "20px",
                borderRadius: borderRadius,
            }}
        />
    );
}

// Skeleton cho Product Card
export function ProductCardSkeleton() {
    return (
        <div className="skeleton-product-card">
            <Skeleton height="180px" borderRadius={8} className="skeleton-image" />
            <div className="skeleton-content">
                <Skeleton height="18px" width="80%" className="skeleton-title" />
                <Skeleton height="22px" width="60%" className="skeleton-price" />
                <Skeleton height="40px" borderRadius={6} className="skeleton-button" />
            </div>
        </div>
    );
}

// Skeleton cho Product List (nhiều cards)
export function ProductListSkeleton({ count = 5 }) {
    return (
        <div className="skeleton-product-list">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}

// Skeleton cho Product Detail page
export function ProductDetailSkeleton() {
    return (
        <div className="skeleton-product-detail">
            <div className="skeleton-detail-left">
                <Skeleton height="400px" borderRadius={12} className="skeleton-main-image" />
                <div className="skeleton-thumb-list">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} width="80px" height="80px" borderRadius={8} />
                    ))}
                </div>
            </div>
            <div className="skeleton-detail-right">
                <Skeleton height="32px" width="70%" className="skeleton-title" />
                <Skeleton height="16px" width="40%" className="skeleton-meta" />
                <Skeleton height="28px" width="30%" className="skeleton-price" />
                <div className="skeleton-quantity-row">
                    <Skeleton height="44px" width="140px" borderRadius={6} />
                    <Skeleton height="20px" width="60px" />
                </div>
                <Skeleton height="50px" width="100%" borderRadius={8} className="skeleton-btn" />
                <div className="skeleton-desc-box">
                    <Skeleton height="20px" width="40%" />
                    <Skeleton height="60px" width="100%" />
                </div>
            </div>
        </div>
    );
}

// Skeleton cho Cart page
export function CartItemSkeleton() {
    return (
        <div className="skeleton-cart-item">
            <Skeleton width="100px" height="100px" borderRadius={8} />
            <div className="skeleton-cart-info">
                <Skeleton height="20px" width="60%" />
                <Skeleton height="14px" width="80%" />
                <Skeleton height="18px" width="30%" />
            </div>
            <div className="skeleton-cart-actions">
                <Skeleton height="24px" width="80px" />
                <Skeleton height="36px" width="100px" borderRadius={6} />
            </div>
        </div>
    );
}

export function CartPageSkeleton() {
    return (
        <div className="skeleton-cart-page">
            <div className="skeleton-cart-left">
                <Skeleton height="32px" width="200px" className="skeleton-title" />
                <Skeleton height="20px" width="150px" />
                <div className="skeleton-cart-items">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CartItemSkeleton key={i} />
                    ))}
                </div>
            </div>
            <div className="skeleton-cart-right">
                <Skeleton height="28px" width="180px" />
                <Skeleton height="60px" width="100%" borderRadius={8} />
                <Skeleton height="80px" width="100%" borderRadius={8} />
                <Skeleton height="24px" width="100%" />
                <Skeleton height="50px" width="100%" borderRadius={8} />
            </div>
        </div>
    );
}

// Skeleton cho Home page sections
export function HomeSectionSkeleton() {
    return (
        <div className="skeleton-home-section">
            <Skeleton height="32px" width="250px" className="skeleton-section-title" />
            <ProductListSkeleton count={5} />
            <Skeleton height="20px" width="300px" className="skeleton-link" />
        </div>
    );
}

// Skeleton cho Banner
export function BannerSkeleton() {
    return (
        <div className="skeleton-banner">
            <Skeleton height="400px" borderRadius={0} />
        </div>
    );
}

// Generic text skeleton
export function TextSkeleton({ lines = 3 }) {
    return (
        <div className="skeleton-text">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="16px"
                    width={i === lines - 1 ? "60%" : "100%"}
                    className="skeleton-line"
                />
            ))}
        </div>
    );
}

// Skeleton cho User Profile page
export function UserProfileSkeleton() {
    return (
        <div className="skeleton-user-profile">
            <div className="skeleton-profile-header">
                <Skeleton width="80px" height="80px" borderRadius="50%" />
                <div className="skeleton-profile-info">
                    <Skeleton height="24px" width="150px" />
                    <Skeleton height="16px" width="200px" />
                </div>
            </div>
            <div className="skeleton-profile-form">
                <Skeleton height="48px" width="100%" borderRadius={8} />
                <Skeleton height="48px" width="100%" borderRadius={8} />
                <Skeleton height="48px" width="100%" borderRadius={8} />
                <Skeleton height="48px" width="100%" borderRadius={8} />
                <Skeleton height="44px" width="140px" borderRadius={8} />
            </div>
        </div>
    );
}

// Skeleton cho User Page (sidebar + main content)
export function UserPageSkeleton() {
    return (
        <div className="skeleton-user-page">
            <div className="skeleton-sidebar">
                <div className="skeleton-user-brief">
                    <Skeleton width="50px" height="50px" borderRadius="50%" />
                    <div className="skeleton-user-meta">
                        <Skeleton height="14px" width="80px" />
                        <Skeleton height="18px" width="120px" />
                    </div>
                </div>
                <div className="skeleton-nav">
                    <Skeleton height="44px" width="100%" borderRadius={8} />
                    <Skeleton height="44px" width="100%" borderRadius={8} />
                </div>
            </div>
            <div className="skeleton-main">
                <UserProfileSkeleton />
            </div>
        </div>
    );
}

// Skeleton cho Order Item
export function OrderItemSkeleton() {
    return (
        <div className="skeleton-order-item">
            <div className="skeleton-order-header">
                <Skeleton height="20px" width="150px" />
                <Skeleton height="24px" width="100px" borderRadius={12} />
            </div>
            <div className="skeleton-order-content">
                <Skeleton width="60px" height="60px" borderRadius={8} />
                <div className="skeleton-order-info">
                    <Skeleton height="18px" width="70%" />
                    <Skeleton height="14px" width="40%" />
                </div>
                <Skeleton height="20px" width="100px" />
            </div>
            <div className="skeleton-order-footer">
                <Skeleton height="16px" width="200px" />
                <Skeleton height="36px" width="120px" borderRadius={6} />
            </div>
        </div>
    );
}

// Skeleton cho Order History
export function OrderHistorySkeleton() {
    return (
        <div className="skeleton-order-history">
            <Skeleton height="28px" width="200px" className="skeleton-title" />
            <div className="skeleton-order-list">
                {Array.from({ length: 3 }).map((_, i) => (
                    <OrderItemSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default Skeleton;
