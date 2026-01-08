import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';
import { salesApi } from '../services/api';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, saleCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const [salesRes, revenueRes] = await Promise.all([
                salesApi.getAll(),
                salesApi.getRevenue()
            ]);
            
            setSales(salesRes.data || []);
            setStats({
                totalRevenue: revenueRes.data || 0,
                saleCount: salesRes.data ? salesRes.data.length : 0
            });
        } catch (error) {
            console.error('Failed to fetch sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        let color = 'hsl(var(--color-text-muted))';
        if (status === 'PAID' || status === 'COMPLETED') color = 'hsl(var(--color-success))';
        if (status === 'PENDING') color = 'hsl(var(--color-warning))';
        if (status === 'CANCELLED') color = 'hsl(var(--color-error))';
        
        return (
            <span style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '26px',
                borderRadius: 'var(--radius-full)', 
                backgroundColor: color.replace(')', ', 0.15)'), 
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {status ? status.replace('_', ' ') : 'UNKNOWN'}
            </span>
        );
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                   <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-1px' }}>Sales <span className="text-gradient">Intelligence</span></h1>
                   <p style={{ color: 'hsl(var(--color-text-muted))', marginTop: '0.25rem' }}>Real-time revenue monitoring and transaction auditing</p>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'hsla(0,0%,100%,0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'hsl(var(--color-text-muted))', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid hsla(0,0%,100%,0.1)' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--color-success))', boxShadow: '0 0 10px hsl(var(--color-success))' }}></div>
                   Live System Active
                </div>
             </div>

             {/* Stats Row */}
             <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem', 
                marginBottom: '3rem' 
             }}>
                <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                        <DollarSign size={80} />
                    </div>
                    <div style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'hsla(var(--color-success), 0.1)', color: 'hsl(var(--color-success))' }}>
                            <TrendingUp size={16} />
                        </div>
                        Total Revenue
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                        ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ marginTop: '1rem', height: '4px', background: 'hsla(0,0%,100%,0.05)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: '70%', background: 'hsl(var(--color-success))', borderRadius: '2px', boxShadow: '0 0 10px hsla(var(--color-success), 0.5)' }}></div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                        <ShoppingCart size={80} />
                    </div>
                    <div style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'hsla(var(--color-primary), 0.1)', color: 'hsl(var(--color-primary))' }}>
                            <ShoppingCart size={16} />
                        </div>
                        Tickets Sold
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                        {stats.saleCount}
                    </div>
                    <div style={{ marginTop: '1rem', height: '4px', background: 'hsla(0,0%,100%,0.05)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: '45%', background: 'hsl(var(--color-primary))', borderRadius: '2px', boxShadow: '0 0 10px hsla(var(--color-primary), 0.5)' }}></div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                        <CreditCard size={80} />
                    </div>
                    <div style={{ color: 'hsl(var(--color-text-muted))', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'hsla(var(--color-warning), 0.1)', color: 'hsl(var(--color-warning))' }}>
                            <CreditCard size={16} />
                        </div>
                        Avg. Transaction
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                        ${stats.saleCount > 0 ? (stats.totalRevenue / stats.saleCount).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                    </div>
                    <div style={{ marginTop: '1rem', height: '4px', background: 'hsla(0,0%,100%,0.05)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: '60%', background: 'hsl(var(--color-warning))', borderRadius: '2px', boxShadow: '0 0 10px hsla(var(--color-warning), 0.5)' }}></div>
                    </div>
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Ledger <span style={{ color: 'hsl(var(--color-text-muted))', fontWeight: '400', fontSize: '1rem' }}>/ Recent Activity</span></h2>
                <button 
                    onClick={fetchSalesData}
                    className="glass-panel" 
                    style={{ 
                        padding: '0.6rem 1.2rem', 
                        fontSize: '0.85rem', 
                        background: 'linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-secondary)))', 
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px hsla(var(--color-primary), 0.3)'
                    }}
                >
                    Refresh Data
                </button>
             </div>
             
             {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="spin" style={{ width: '40px', height: '40px', border: '3px solid hsla(0,0%,100%,0.1)', borderTopColor: 'hsl(var(--color-primary))', borderRadius: '50%', margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem', color: 'hsl(var(--color-text-muted))' }}>Analyzing current sales vectors...</p>
                </div>
             ) : (
                <div className="glass-panel" style={{ overflow: 'hidden', border: '1px solid hsla(0,0%,100%,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'hsla(0,0%,0%,0.2)', color: 'hsl(var(--color-text-muted))', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Reference</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Customer</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Method</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Volume</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Amount</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Status</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} className="table-row-hover" style={{ borderBottom: '1px solid hsla(0,0%,100%,0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', color: 'white' }}>{sale.id.substring(0, 8).toUpperCase()}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))' }}>TXN-REF</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'hsla(var(--color-primary), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'hsl(var(--color-primary))' }}>
                                                {sale.userId ? sale.userId.substring(0, 2).toUpperCase() : 'AJ'}
                                            </div>
                                            <span style={{ fontSize: '0.9rem' }}>{sale.userId || 'Albert Johnson'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ 
                                            fontSize: '0.7rem', 
                                            fontWeight: '800', 
                                            background: 'hsla(0,0%,100%,0.05)', 
                                            padding: '0.2rem 0.5rem', 
                                            borderRadius: '4px',
                                            border: '1px solid hsla(0,0%,100%,0.1)',
                                            color: 'hsl(var(--color-text-muted))'
                                        }}>
                                            {sale.paymentMethod || 'N/A'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'hsla(0,0%,100%,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                                                {sale.quantity}
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-muted))' }}>Unit{sale.quantity > 1 ? 's' : ''}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'hsl(var(--color-primary))' }}>
                                            ${sale.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}><StatusBadge status={sale.saleStatus} /></td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'white' }}>{new Date(sale.saleDate).toLocaleDateString()}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))' }}>{new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '5rem', textAlign: 'center' }}>
                                        <div style={{ color: 'hsl(var(--color-text-muted))', opacity: 0.5 }}>
                                            <ShoppingCart size={48} style={{ margin: '0 auto 1rem' }} />
                                            <p style={{ fontSize: '1.1rem' }}>No transaction data available currently.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             )}
        </div>
    );
};

export default Sales;
