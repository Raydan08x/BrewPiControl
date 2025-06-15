"""
Add is_national and country columns to providers table
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('providers', sa.Column('is_national', sa.Boolean(), nullable=True))
    op.add_column('providers', sa.Column('country', sa.String(), nullable=True))

def downgrade():
    op.drop_column('providers', 'country')
    op.drop_column('providers', 'is_national')
