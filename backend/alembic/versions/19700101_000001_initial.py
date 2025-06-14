"""
Initial migration: create inventory_items and providers tables
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'providers',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(), nullable=False, unique=True, index=True),
        sa.Column('contact', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('notes', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        'inventory_items',
        sa.Column('lot_number', sa.String(), primary_key=True, index=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('category', sa.Enum('malt', 'hop', 'yeast', 'additive', 'package', 'consumable', name='inventory_category_enum'), nullable=False),
        sa.Column('quantity_available', sa.Numeric(12, 3), nullable=False, default=0),
        sa.Column('unit', sa.String(), nullable=False),
        sa.Column('supplier', sa.String(), nullable=True),
        sa.Column('manufacturer', sa.String(), nullable=True),
        sa.Column('origin', sa.Enum('nacional', 'importada', name='inventory_origin_enum'), nullable=True),
    )

def downgrade():
    op.drop_table('inventory_items')
    op.drop_table('providers')
    op.execute('DROP TYPE IF EXISTS inventory_category_enum')
    op.execute('DROP TYPE IF EXISTS inventory_origin_enum')
